# Radio group set

radio.set_group(167)

# Basic variables defined

sequence_counter = 1
object_counter = 1
risk_levels = ["LO", "MD", "HI"]
sys_state = "IDLE"
basic.show_string("SCAN")
seq_text = ""
obj = ""
object_counter = 0
sequence_number = 0
current_risk_index = 0

# Method for returning the next sequence

def next_sequence():
    global seq_text, sequence_number
    if sequence_number < 10:
        seq_text = "O" + ("" + str(sequence_number))
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
    asciichars = "!,-.0123456789?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"

    for ch in data:
        code = 32
        for i in range(len(asciichars)):
            if asciichars[i] == ch:
                code = 32 + i
                break
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

# Method to handle risk clasification from sensor_val (simple if/elif statement)

def classify_risk_from_sensor(sensor_val: any):
    if sensor_val < 350:
        return "LO"
    elif sensor_val < 700:
        return "MD"
    else:
        return "HI"

# Method to build the packet to be transmitted's payload

def build_payload(obj_id, risk):
    return "OBJ" + obj_id + ",RSK" + risk

# Method to build the packet to be transmitted

def build_packet(obj_id, risk):
    seq = next_sequence()
    payload = build_payload(obj_id, risk)
    data = "SCAN|" + seq + "|" + payload
    checksum = calc_checksum("")
    packet = data + "|" + checksum
    return packet

# Method to transmit the scanner's build_packet

def transmit_scanner_packet(packet):
    radio.send_string(packet)
    serial.write_line("TX: " + packet)

# Event handler

def event_handler(risk):
    global sys_state
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
    risk = classify_risk_manual_cycle()
    event_handler(risk)
    
input.on_button_pressed(Button.A, on_button_pressed_a)

# Method to handle button B Event

def on_button_pressed_b():
    pass

input.on_button_pressed(Button.B, on_button_pressed_b)
