# Radio group set

radio.set_group(167)

# Basic variables defined

sequence_number = 1
object_counter = 1
risk_levels = ["LO", "MD", "HI"]
sys_state = "IDLE"
def classify_risk_from_sensor(sensor_val: any):
    pass
def build_payload(obj_id: any, risk: any):
    pass
def build_packet(obj_id2: any, risk2: any):
    pass
def transmit_scan(packet: any):
    pass
def handle_detected_event(risk3: any):
    pass
basic.show_string("SCAN")

seq_text = ""
object2 = ""
object_counter = 0
sequence_number = 0
current_risk_index = 0

# Method for returning the next object ID

def next_object_id():
    global object2, object_counter
    object2 = "D" + ("" + str(object_counter))
    object_counter += 1
    if object_counter > 9:
        object_counter = 1
    return object2
    
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
    pass

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

# Method to handle button A Event

def on_button_pressed_a():
    pass
    
input.on_button_pressed(Button.A, on_button_pressed_a)

# Method to handle button B Event

def on_button_pressed_b():
    pass

input.on_button_pressed(Button.B, on_button_pressed_b)
