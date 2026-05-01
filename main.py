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