play_and_code_spring2020_cse323_final_project = ''

def move_forward():
    global play_and_code_spring2020_cse323_final_project
    play_and_code_spring2020_cse323_final_project += 'F'

def turn_left():
    global play_and_code_spring2020_cse323_final_project
    play_and_code_spring2020_cse323_final_project += 'L'

def turn_right():
    global play_and_code_spring2020_cse323_final_project
    play_and_code_spring2020_cse323_final_project += 'R'

def pickup():
    global play_and_code_spring2020_cse323_final_project
    play_and_code_spring2020_cse323_final_project += 'P'

def is_open(i):
    if i < 0 or i >= len(doors):
        raise TypeError("Invalid argument!")
    return doors[i] == 7 or doors[i] == 9

def press_button():
    global play_and_code_spring2020_cse323_final_project
    play_and_code_spring2020_cse323_final_project += 'B'

doors = [9,9,7,9]


def run():
	def move(n):
		for i in range(n):
			move_forward()
	def turn_arround():
		turn_left()
		turn_left()
	def move_pickup(n):
		for i in range(n):
			move_forward()
			pickup()
	move(3)
	turn_right()
	if not is_open(0):
		press_button()
	move(2)
	turn_right()
	move(3)
	turn_left()
	if not is_open(1):
		press_button()
	move(2)
	turn_left()
	move(6)
	pickup()
	turn_left()
	move(4)
	pickup()
	turn_arround()
	move(4)
	if not is_open(3):
		press_button()
	move(2)
	pickup()
	turn_arround()
	move(2)
	turn_right()
	move_forward()
	if not is_open(2):
		press_button()
	move(2)
	turn_left()
	move_pickup(1)
	turn_right()
	move_pickup(3)
	turn_left()
	move_pickup(1)
	turn_left()
	move_pickup(3)
	
	
	return play_and_code_spring2020_cse323_final_project