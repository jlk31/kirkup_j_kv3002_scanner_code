//  Radio group set
radio.setGroup(67)
//  Basic variables defined
let sequence_number = 1
let object_counter = 1
let current_risk_index = 0
let risk_levels = ["LO", "MD", "HI"]
let sys_state = "IDLE"
//  Method for returning the next sequence
function next_sequence(): string {
    
    let seq_text = ""
    if (sequence_number < 10) {
        seq_text = "O" + ("" + sequence_number)
    } else {
        seq_text = "" + sequence_number
    }
    
    sequence_number += 1
    if (sequence_number > 99) {
        sequence_number = 1
    }
    
    return seq_text
}

//  Method for returning the next object ID
function next_object_id() {
    
    let object = "D" + ("" + object_counter)
    object_counter += 1
    if (object_counter > 9) {
        object_counter = 1
    }
    
    return object
}

