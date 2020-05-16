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

