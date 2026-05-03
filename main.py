# Radio group set to 167

radio.set_group(167)

# Basic variables defined

# Sequence and object counters defined at 1 to align with 01-99 and D1-D9 protocol expectations
sequence_counter = 1
object_counter = 1
current_risk_index = 0
seq_text = ""
obj = ""
risk_levels = ["LO", "MD", "HI"]

sys_state = "IDLE"
# Cooldown variables defined
last_send_time = -2000
cooldown_ms = 1500

packets_sent = 0
manual_events = 0
sensor_events = 0
cooldown_blocks = 0

basic.show_string("SCAN")

# Method for returning the next sequence

def next_sequence():
    global seq_text, sequence_counter
    if sequence_number < 10:
        seq_text = "0" + ("" + str(sequence_number))
    else:
        seq_text = "" + str(sequence_number)

    sequence_number += 1
    if sequence_number > 99:
        sequence_number = 1
        
    return seq_text

# Method for returning the next object ID

def next_object_id():
    global obj, object_counter
    obj = "D" + ("" + str(object_counter))
    object_counter += 1
    if object_counter > 9:
        object_counter = 1
    return obj
    
# Checksum calculation Method

def calc_checksum(data:str) -> str:
    total = 0
    asciichars = " !,-.0123456789?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    for ch in data:
        code = 32
        for i in range(len(asciichars)):
            if asciichars[i] == ch:
                code = 32 + i
                break
        # total contained outside of lookup loop to produce a viable checksum
        total = (total + code) % 256

    hexchars = "0123456789ABCDEF"
    return hexchars[total // 16] + hexchars[total % 16]

# Manual risk classification cycle method

def classify_risk_manual_cycle():
    global current_risk_index
    risk = risk_levels[current_risk_index]
    current_risk_index += 1

    if current_risk_index >= len(risk_levels):
        current_risk_index = 0

    return risk

# Method to read light levels

def read_smoothed_light():
    total = 0
    for i in range(3):
        total += input.light_level()
        basic.pause(20)
    return total // 3

# Method to handle risk clasification from sensor_val (simple if/elif statement)

def classify_risk_from_sensor(sensor_val: any):
    if sensor_val < 80:
        return "LO"
    elif sensor_val < 160:
        return "MD"
    else:
        return "HI"

# Method to determine when the scanner is READY

def scanner_ready():
    return input.running_time() - last_send_time >= cooldown_ms

# Method to build the packet to be transmitted's payload

def build_payload(obj_id, risk):
    return "OBJ" + obj_id + ",RSK" + risk

# Method to build the packet to be transmitted

def build_packet(obj_id, risk):
    seq = next_sequence()
    payload = build_payload(obj_id, risk)
    data = "SCAN|" + seq + "|" + payload
    # data is called within calc_checksum method to calculate every packet checksum on numeric format
    checksum = calc_checksum(data)
    packet = data + "|" + checksum
    return packet

# Method to log the scanner's current state and event details to the serial monitor

def log_status(mode, sensor_val, obj_id, risk, packet):
    serial.write_line("STATE=" + sys_state)
    serial.write_line("MODE=" + mode)
    serial.write_line("SENSOR=" + str(sensor_val))
    serial.write_line("OBJ=" + obj_id)
    serial.write_line("RISK=" + risk)
    serial.write_line("PACKET=" + packet)
    serial.write_line("---")

# Method to transmit the scanner's build_packet

def transmit_scanner_packet(packet):
    global packets_sent
    radio.send_string(packet)
    packets_sent += 1
    serial.write_line("TX: " + packet)

# Event handler

def event_handler(risk, mode, sensor_val):
    global sys_state, last_send_time, cooldown_blocks

    # If statement to handle attempts at using the scanner if it is still on cooldown
    if not scanner_ready():
        sys_state = "SCANNER IS STILL ON COOLDOWN"
        cooldown_blocks += 1
        serial.write_line("BLOCKED=Cooldown active")
        basic.show_icon(IconNames.NO)
        basic.pause(200)
        basic.clear_screen()
        sys_state = "IDLE"
        return

    # If statement to handle invalid risk levels that are not recognised by the system
    if risk != "LO" and risk != "MD" and risk != "HI":
        sys_state = "INVALID RISK LEVEL"
        serial.write_line("ERROR=Invalid risk level")
        basic.show_icon(IconNames.NO)
        basic.pause(200)
        basic.clear_screen()
        sys_state = "IDLE"
        return  

    sys_state = "EVENT DETECTED"
    obj_id = next_object_id()

    sys_state = "CLASSIFIED"
    packet = build_packet(obj_id, risk)

    sys_state = "PACKET READY"
    transmit_scanner_packet(packet)

    sys_state = "TRANSMITTED"
    basic.show_string(risk)
    basic.pause(200)
    basic.clear_screen()

    sys_state = "IDLE"


# Method to handle button A Event

def on_button_pressed_a():
    global manual_events
    manual_events += 1
    risk = classify_risk_manual_cycle()
    event_handler(risk, "MANUAL", -1)
    
input.on_button_pressed(Button.A, on_button_pressed_a)

# Method to handle button B event (uses light level sensor from grove kit)

def on_button_pressed_b():
    global sensor_events
    sensor_events += 1
    sensor_val = input.light_level()
    risk = classify_risk_from_sensor(sensor_val)
    serial.write_line("Sensor value: " + str(sensor_val))
    event_handler(risk, "SENSOR", sensor_val)

input.on_button_pressed(Button.B, on_button_pressed_b)

# Method to handle buttons A and B events simultaneously

def on_button_pressed_ab():
    serial.write_line("STATS")
    serial.write_line("Packets sent=" + str(packets_sent))
    serial.write_line("Manual events=" + str(manual_events))
    serial.write_line("Sensor events=" + str(sensor_events))
    serial.write_line("Cooldown blocks=" + str(cooldown_blocks))
    serial.write_line("State" + sys_state)
    serial.write_line("------")

input.on_button_pressed(Button.AB, on_button_pressed_ab)