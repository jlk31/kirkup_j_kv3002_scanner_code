# Radio group set

radio.set_group(67)

# Basic variables defined

sequence_number = 1
object_counter = 1
current_risk_index = 0
risk_levels = ["LO", "MD", "HI"]
sys_state = "IDLE"

# Method for returning the next sequence

def next_sequence():
    global sequence_number
    seq_text = ""
    if sequence_number < 10:
        seq_text = "O" + str(sequence_number)
    else:
        seq_text = str(sequence_number)

    sequence_number += 1
    if sequence_number > 99:
        sequence_number = 1

    return seq_text

# Method for returning the next object ID

def next_object_id():
    global object_counter
    object = "D" + str(object_counter)
    object_counter += 1
    if object_counter > 9:
        object_counter = 1

    return object

# Checksum calculation Method

def calc_checksum(data):
    total = 0
    for i in range(

        

    ):
        total += ord(data[i])
    val = total % 256
    hexchars = "0123456789ABCDEF"
    return hexchars[val // 16] + hexchars[val % 16]

# Manual risk classification cycle method

def classify_risk_manual_cycle():
    pass

# Sensor-obtained risk classification cycle Method

def classify_risk_from_sensor(sensor_val):
    pass

# Method to build packet payload

def build_payload(obj_id, risk):
    pass

# Method to build packet

def build_packet(obj_id, risk):
    pass

# Scan transmission Method

def transmit_scan(packet):
    pass

# Event handler

def handle_detected_event(risk):
    pass

# Method to handle button A Event

def on_button_pressed_a():
    pass

input.on_button_pressed(Button.A, on_button_pressed_a)

# Method to handle button B Event

def on_button_pressed_b():
    pass

input.on_button_pressed(Button.B, on_button_pressed_b)

basic.show_string("SCAN")

