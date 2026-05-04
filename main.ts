//  Radio group set to 67
radio.setGroup(67)
//  Basic variables defined
//  Sequence and object counters defined at 1 to align with 01-99 and D1-D9 protocol expectations
let sequence_counter = 1
let object_counter = 1
let current_risk_index = 0
let seq_text = ""
let obj = ""
let risk_levels = ["LO", "MD", "HI"]
let sys_state = "IDLE"
//  Cooldown variables defined
let last_send_time = -2000
let cooldown_ms = 1500
let packets_sent = 0
let manual_events = 0
let sensor_events = 0
let cooldown_blocks = 0
basic.showString("SCAN")
//  Method for returning the next sequence
function next_sequence(): string {
    
    if (sequence_counter < 10) {
        seq_text = "0" + ("" + ("" + sequence_counter))
    } else {
        seq_text = "" + ("" + sequence_counter)
    }
    
    sequence_counter += 1
    if (sequence_counter > 99) {
        sequence_counter = 1
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
    let asciichars = " !,-.0123456789?ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"
    for (let ch of data) {
        code = 32
        for (let i = 0; i < asciichars.length; i++) {
            if (asciichars[i] == ch) {
                code = 32 + i
                break
            }
            
        }
        //  total contained outside of lookup loop to produce a viable checksum
        total = (total + code) % 256
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

//  Method to read light levels
function read_smoothed_light(): number {
    let total = 0
    for (let i = 0; i < 3; i++) {
        total += input.lightLevel()
        basic.pause(20)
    }
    return Math.idiv(total, 3)
}

//  Method to handle risk clasification from sensor_val (simple if/elif statement)
function classify_risk_from_sensor(sensor_val: any): string {
    if (sensor_val < 80) {
        return "LO"
    } else if (sensor_val < 160) {
        return "MD"
    } else {
        return "HI"
    }
    
}

//  Method to determine when the scanner is READY
function scanner_ready() {
    return input.runningTime() - last_send_time >= cooldown_ms
}

//  Method to build the packet to be transmitted's payload
function build_payload(obj_id: string, risk: string) {
    return "OBJ:" + obj_id + ",RSK:" + risk
}

//  Method to build the packet to be transmitted
function build_packet(obj_id: string, risk: string): string {
    let seq = next_sequence()
    let payload = build_payload(obj_id, risk)
    let data = "SC|" + seq + "|" + payload
    //  data is called within calc_checksum method to calculate every packet checksum on numeric format
    let checksum = calc_checksum(data)
    let packet = data + "|" + checksum
    return packet
}

//  Method to log the scanner's current state and event details to the serial monitor
function log_status(mode: any, sensor_val: any, obj_id: any, risk: any, packet: any) {
    serial.writeLine("STATE=" + sys_state)
    serial.writeLine("MODE=" + mode)
    serial.writeLine("SENSOR=" + ("" + sensor_val))
    serial.writeLine("OBJ=" + obj_id)
    serial.writeLine("RISK=" + risk)
    serial.writeLine("PACKET=" + packet)
    serial.writeLine("---")
}

//  Method to transmit the scanner's build_packet
function transmit_scanner_packet(packet: string) {
    
    radio.sendString(packet)
    serial.writeLine(packet)
    packets_sent += 1
    serial.writeLine("TX: " + packet)
}

//  Event handler
function event_handler(risk: string, mode: string, sensor_val: number) {
    
    //  If statement to handle attempts at using the scanner if it is still on cooldown
    if (!scanner_ready()) {
        sys_state = "SCANNER IS STILL ON COOLDOWN"
        cooldown_blocks += 1
        serial.writeLine("BLOCKED=Cooldown active")
        basic.showIcon(IconNames.No)
        basic.pause(200)
        basic.clearScreen()
        sys_state = "IDLE"
        return
    }
    
    //  If statement to handle invalid risk levels that are not recognised by the system
    if (risk != "LO" && risk != "MD" && risk != "HI") {
        sys_state = "INVALID RISK LEVEL"
        serial.writeLine("ERROR=Invalid risk level")
        basic.showIcon(IconNames.No)
        basic.pause(200)
        basic.clearScreen()
        sys_state = "IDLE"
        return
    }
    
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
    
    manual_events += 1
    let risk = classify_risk_manual_cycle()
    event_handler(risk, "MANUAL", -1)
})
//  Method to handle button B event (uses light level sensor from grove kit)
input.onButtonPressed(Button.B, function on_button_pressed_b() {
    
    sensor_events += 1
    let sensor_val = input.lightLevel()
    let risk = classify_risk_from_sensor(sensor_val)
    serial.writeLine("Sensor value: " + ("" + sensor_val))
    event_handler(risk, "SENSOR", sensor_val)
})
//  Method to print scanner statistics to serial when A and B are pressed simultaneously
//  Method for debug and reporting to check scanner state, event counts and cooldown behaviour
//  without affecting packet transmission
input.onButtonPressed(Button.AB, function on_button_pressed_ab() {
    serial.writeLine("STATS")
    serial.writeLine("Packets sent=" + ("" + packets_sent))
    serial.writeLine("Manual events=" + ("" + manual_events))
    serial.writeLine("Sensor events=" + ("" + sensor_events))
    serial.writeLine("Cooldown blocks=" + ("" + cooldown_blocks))
    serial.writeLine("State" + sys_state)
    serial.writeLine("------")
})
