# OCS: Semi-Autonomous Debris-Response Control System Scanner Bot code

This repository contains my solutions to a 1st year group coursework assignment on Physical Computing and logic with microcontrollers at **Northumbria University**.

## Challenge Requirements

- Use one micro:bit per tean nenver, with each member owning one node
- Use radio communication only between nodes; no physical node-to-node wiring is prohibited
- Define and document a shared packet protocol before full system integration
- Ensure every Mission Control command produces an ACK from the addressed node
- Demonstrate at least one defined fault scenario and how the system handles it
- Use available class Grove Inventor Kit hardware

## System Architecture

The system is designed as a multi-node physical computing network. A typical five-node implementation follows the role framework below:

| Node | Role | Responsibility |
|------|------|----------------|
| Node 1 | Scanner | Detects or simulates debris events, classifies risk, and transmits a structured packet [1]. |
| Node 2 | Mission Control | Receives packets, applies decision logic, dispatches commands, enforces ACK-before-next-command behaviour, and outputs mission status [1]. |
| Node 3 | Capture Drone A | Responds only to addressed commands, performs a capture attempt, and returns ACK status [1]. |
| Node 4 | Capture Drone B | Performs the same minimum drone responsibilities while maintaining independent behaviour/state [1]. |
| Node 5 | Operator Display | Receives mission updates and presents mission state clearly to a human operator in groups of five [1]. |

## Packet Protocol

The challenge requires teams to define a structured packet with minimum content including an object identifier, risk classification, and sequence number. Mission Control must parse incoming packets and send addressed commands, while drones must return ACK responses such as success, busy, or failed.

## Setup

1. Clone or download the repository.
2. Flash each Python file in `src/` to the correct micro:bit.
3. Connect the required Grove Inventor Kit components for each node.
4. Make sure all devices use the agreed radio group and packet format.
5. Start the Scanner node first, then Mission Control, then the drone nodes, and finally the Operator Display if used.

## Running the System

A successful end-to-end demonstration should show the following sequence, which matches the brief's required mission outcomes [1]:

1. The Scanner detects or simulates a debris event and transmits a structured packet.
2. Mission Control receives the packet, parses it, and applies decision logic.
3. Mission Control sends a command to a selected drone and waits for an ACK before issuing another command.
4. The addressed drone performs a capture attempt and returns an ACK such as `success`, `busy`, or `failed`.
5. Mission state is communicated clearly through serial output, display feedback, indicators, or a hybrid approach.

