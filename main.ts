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

//  Checksum calculation Method

//  Manual risk classification cycle method
function classify_risk_manual_cycle() {
    
}

//  Sensor-obtained risk classification cycle Method
function classify_risk_from_sensor(sensor_val: any) {
    
}

//  Method to build packet payload
function build_payload(obj_id: any, risk: any) {
    
}

//  Method to build packet
function build_packet(obj_id: any, risk: any) {
    
}

//  Scan transmission Method
function transmit_scan(packet: any) {
    
}

//  Event handler
function handle_detected_event(risk: any) {
    
}

//  Method to handle button A Event
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
})
//  Method to handle button B Event
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
})
basic.showString("SCAN")
