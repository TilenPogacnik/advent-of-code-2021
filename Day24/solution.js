/*
This one was solved completely on paper. This code is for checking if model number is valid (z == 0). 
I totally didn't write this code to brute force the solution 🙈

SOLUTION PROCESS: 
When we analyze the input code we notice it has 14 repeating blocks, each one 18 lines long. The only difference between blocks are three numbers, 
we will call them A (first appears in line 5), B (first appears in line 11) and C (first appears in line 16).
Each block also uses one digit from our model number, we will call them wX, where X is the block number.
Value of z carries over from previous blocks.

If we simplify the code blocks, we get something similar to this:
    block (A, B, C, w, z){
        x = z % 26 + B != w ? 1 : 0
        z = z / A
        if (x == 1){
            z = 26 * z + (w + C)
        }
    }

Our input values were:
A:  1,  1,  1, 26,  1,  1,  1, 26, 26,  1, 26, 26, 26,  26
B: 11, 14, 10,  0, 12, 12, 12, -8, -9, 11,  0, -5, -6, -12
C:  8, 13,  2,  7, 11,  4, 13, 13, 10,  1,  2, 14,  6,  14

We notice that z behaves like a stack in a base 26 system when we use a valid model number:
PUSH happens when A == 1 and x == 1. 
    Current stack (z) is multiplied by 26 and a new value (w + C) is pushed to the stack.
    Push happens 7 times in our input code - every time A == 1 and B > 9.

POP happens when A == 26 and x == 0.
    Popped value is z % 26. (The last (w+C) that we pushed)
    Current stack (z) is divided by 26 and rounded down. Second newest value is now on top of the stack.
    We guarantee that x == 0 when we use a valid model number so we don't push anything new to the stack. 
        A valid model number must satisfy this condition to ensure x == 0: (poppedValue + B == w)

We can simulate all 14 blocks of our input code by hand:

1. PUSH A = 1, B = 11, C = 8 
    Stack: [w1+8]

2. PUSH A = 1, B = 14, C = 13
    Stack: [w1+8, w2+13]

3. PUSH A = 1, B = 10, C = 2
    Stack: [w1+8, w2+13, w3+2]

4. POP A = 26, B = 0, C = 7
    Stack: [w1+8, w2+13]
    Popped: w3+2

    CONDITION: w3+2 + 0 == w4

5. PUSH A = 1, B = 12, C = 11
    Stack: [w1+8, w2+13, w5+11]

6. PUSH A = 1, B = 12, C = 4
    Stack: [w1+8, w2+13, w5+11, w6+4]

7. PUSH A = 1, B = 12, C = 13
    Stack: [w1+8, w2+13, w5+11, w6+4, w7+13]

8. POP A = 26, B = -8, C = 13
    Stack: [w1+8, w2+13, w5+11, w6+4]
    Popped:  w7+13

    CONDITION: w7 + 13 - 8 == w8 

9. POP A = 26, B = -9, C = 10
    Stack: [w1+8, w2+13, w5+11]
    Popped:  w6+4

    CONDITION:  w6 + 4 - 9 == w9

10. PUSH A = 1, B = 11, C = 1
    Stack: [w1+8, w2+13, w5+11, w10+1]

11. POP A = 26, B = 0, C = 2
    Stack: [w1+8, w2+13, w5+11]
    Popped:  w10+1

    CONDITION:  w10 + 1 + 0 == w11  

12. POP A = 26, B = -5, C = 14
    Stack: [w1+8, w2+13]
    Popped:  w5+11

    CONDITION:  w5 + 11 - 5 == w12

13. POP A = 26, B = -6, C = 6
    Stack: [w1+8]
    Popped: w2+13

    CONDITION: w2 + 13 - 6 == w13

14. POP A = 26, B = -12, C = 14
    Stack: []
    Popped: w1+8

    CONDITION: w1 + 8 - 12 = w14

A valid model number has a length of 14 (w1 to w14) and satisfies all pop conditions:
    w3 + 2 == w4
    w7 + 5 == w8 
    w6 - 5 == w9
    w10 + 1 == w11
    w5 + 6 == w12
    w2 + 7 == w13
    w1 - 4 = w14

Now that we know all constraints of a valid model number it is trivial to construct the largest and smallest possible model numbers: 92793949489995 and 51131616112781.
*/


const fs = require("fs");
const input = fs.readFileSync("./input.txt").toString("utf-8").split('\n');

let monad = parseInput();
let maxModelNumber = '92793949489995';
let minModelNumber = '51131616112781';
console.log("(Part 1) Z value for largest model number 92793949489995: " + executeInstructions(monad, maxModelNumber)[2]);
console.log("(Part 2) Z value for smallest model number 51131616112781: " + executeInstructions(monad, minModelNumber)[2]);

function parseInput(){
    let instructions = [];
    input.forEach(line => {
        instructions.push(parseInstruction(line));
    });

    return instructions;
}

function parseInstruction(instruction){
    let splitInstruction = instruction.split(" ");
    let instr;
    switch (splitInstruction[0]){
        case "inp":
            return [inp, [getVariableNum(splitInstruction[1])]];
        case "add":
            instr = add;
            break;
        case "mul":
            instr = mul;
            break;
        case "div":
            instr = div;
            break;
        case "mod":
            instr = mod;
            break;
        case "eql":
            instr = eql;
            break;
    }

    return [instr, [getVariableNum(splitInstruction[1]), !isNaN(splitInstruction[2]) ? parseInt(splitInstruction[2]) : getVariableNum(splitInstruction[2]), !isNaN(splitInstruction[2])]];
}

function executeInstructions(instructions, input){
    let vars = [0,0,0,0];
    let splitInput = input.split('').map(x => +x);

    instructions.forEach((instruction, i) => {
        instruction[0](vars, splitInput, ...instruction[1]);
    });

    return vars;
}

function getVariableNum(variable){
    switch(variable){
        case "x":
            return 0;
        case "y":
            return 1;
        case "z":
            return 2;
        case "w":
            return 3;
    }
}

//inp a
function inp(vars, input, variable){
    vars[variable] = input.shift();
}

//add a b
function add(vars, input, variable, argument, isNumber){
    vars[variable] += isNumber ? argument : vars[argument];
}

//mul a b
function mul (vars, input, variable, argument, isNumber){
    vars[variable] = vars[variable] * (isNumber ? argument : vars[argument]);
}

//div a b
function div (vars, input, variable, argument, isNumber){
    let result = Math.floor(vars[variable] / (isNumber ? argument : vars[argument]));
    vars[variable] = result;
}

//mod a b
function mod (vars, input, variable, argument, isNumber){
    vars[variable] = vars[variable] % (isNumber ? argument : vars[argument]);
}

//eql a b
function eql (vars, input, variable, argument, isNumber){
    vars[variable] = vars[variable] == (isNumber ? argument : vars[argument]) ? 1 : 0;
}