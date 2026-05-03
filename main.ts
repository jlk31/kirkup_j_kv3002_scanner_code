//  Radio group set
radio.setGroup(167)
//  Basic variables defined
let sequence_number = 1
let object_counter = 1
let risk_levels = ["LO", "MD", "HI"]
let sys_state = "IDLE"
function classify_risk_from_sensor(sensor_val: any) {
    
}

function build_payload(obj_id: any, risk: any) {
    
}

function build_packet(obj_id2: any, risk2: any) {
    
}

function transmit_scan(packet: any) {
    
}

function handle_detected_event(risk3: any) {
    
}

basic.showString("SCAN")
let seq_text = ""
let object2 = ""
object_counter = 0
sequence_number = 0
let current_risk_index = 0
//  Method for returning the next object ID
function next_object_id(): string {
    
    object2 = "D" + ("" + ("" + object_counter))
    object_counter += 1
    if (object_counter > 9) {
        object_counter = 1
    }
    
    return object2
}

//  Checksum calculation Method
function calc_checksum(data: string): string {
    let code: number;
    let total = 0
    let asciichars = "!,-.0123456789?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    for (let ch of data) {
        code = 32
        for (let i = 0; i < asciichars.length; i++) {
            if (asciichars[i] == ch) {
                code = 32 + i
                break
            }
            
            total = (total + code) % 256
        }
    }
    let hexchars = "0123456789ABCDEF"
    return hexchars[Math.idiv(total, 16)] + hexchars[total % 16]
}

//  Manual risk classification cycle method
function classify_risk_manual_cycle() {
    
}

//  Method for returning the next sequence
function next_sequence(): string {
    
    if (sequence_number < 10) {
        seq_text = "O" + ("" + ("" + sequence_number))
    } else {
        seq_text = "" + ("" + sequence_number)
    }
    
    sequence_number += 1
    if (sequence_number > 99) {
        sequence_number = 1
    }
    
    return seq_text
}

//  Method to handle button A Event
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    
})
//  Method to handle button B Event
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
})
