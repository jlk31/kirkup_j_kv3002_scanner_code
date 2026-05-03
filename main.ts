//  Radio group set
radio.setGroup(167)
//  Basic variables defined
//  Sequence and object counters defined at 1 to align with 01-99 and D1-D9 protocol expectations
let sequence_counter = 1
let object_counter = 1
let risk_levels = ["LO", "MD", "HI"]
let sys_state = "IDLE"
let seq_text = ""
let obj = ""
let current_risk_index = 0
//  Method for returning the next sequence
function next_sequence(): string {
    let sequence_number: number;
    
    if (sequence_number < 10) {
        seq_text = "0" + ("" + ("" + sequence_number))
    } else {
        seq_text = "" + ("" + sequence_number)
    }
    
    sequence_number += 1
    if (sequence_number > 99) {
        sequence_number = 1
    }
    
    return seq_text
}

//  Method for returning the next object ID
function next_object_id(): string {
    
    obj = "D" + ("" + ("" + object_counter))
    object_counter += 1
    if (object_counter > 9) {
        object_counter = 1
    }
    
    return obj
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
function classify_risk_manual_cycle(): string {
    
    let risk = risk_levels[current_risk_index]
    current_risk_index += 1
    if (current_risk_index >= risk_levels.length) {
        current_risk_index = 0
    }
    
    return risk
}

//  Method to handle risk clasification from sensor_val (simple if/elif statement)
function classify_risk_from_sensor(sensor_val: any): string {
    if (sensor_val < 350) {
        return "LO"
    } else if (sensor_val < 700) {
        return "MD"
    } else {
        return "HI"
    }
    
}

//  Method to build the packet to be transmitted's payload
function build_payload(obj_id: string, risk: string) {
    return "OBJ" + obj_id + ",RSK" + risk
}

//  Method to build the packet to be transmitted
function build_packet(obj_id: string, risk: string): string {
    let seq = next_sequence()
    let payload = build_payload(obj_id, risk)
    let data = "SCAN|" + seq + "|" + payload
    //  data is called within calc_checksum method to calculate every packet checksum on numeric format
    let checksum = calc_checksum(data)
    let packet = data + "|" + checksum
    return packet
}

//  Method to transmit the scanner's build_packet
function transmit_scanner_packet(packet: string) {
    radio.sendString(packet)
    serial.writeLine("TX: " + packet)
}

//  Event handler
function event_handler(risk: string) {
    
    sys_state = "EVENT DETECTED"
    let obj_id = next_object_id()
    sys_state = "CLASSIFIED"
    let packet = build_packet(obj_id, risk)
    sys_state = "PACKET READY"
    transmit_scanner_packet(packet)
    sys_state = "TRANSMITTED"
    basic.showString(risk)
    basic.pause(200)
    basic.clearScreen()
    sys_state = "IDLE"
}

//  Method to handle button A Event
input.onButtonPressed(Button.A, function on_button_pressed_a() {
    let risk = classify_risk_manual_cycle()
    event_handler(risk)
})
//  Method to handle button B Event (uses light level sensor from grove kit)
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    let sensor_val = input.lightLevel()
    let risk = classify_risk_from_sensor(sensor_val)
    serial.writeLine("Sensor value: " + ("" + sensor_val))
    event_handler(risk)
})
basic.showString("SCAN")
