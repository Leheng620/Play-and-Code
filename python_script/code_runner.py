out = ''

def move_forward():
    global out
    out += 'F'

def turn_left():
    global out
    out += 'L'

def turn_right():
    global out
    out += 'R'

def run():
	move_forward()
	move_forward()
	turn_left()
	turn_right()
	
	return out