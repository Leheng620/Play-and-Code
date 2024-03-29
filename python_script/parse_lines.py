import os
from pathlib import Path # only support python 3.4+
# import code_runner


# read code line by line from the input, and write it to code_runner, then run it.
def main(data):
	data = data.split('\n')
	path = os.path.abspath(os.path.realpath(__file__))
	path = path[:path.rfind('parse_lines.py')]
	runner_path = path + 'code_runner.py'
	module_path = path + 'format_output.py'
	runner_path = Path(runner_path)
	if(os.path.exists(runner_path)):
		os.remove(runner_path)
	output = open(runner_path, "w")
	read_module = open(module_path)
	
	for line in read_module:
		output.write(line)


	ind = 0
	for line in data:
		if ind == 0:
			output.write('doors = ['+line+']\n')
			# output.write('from format_output import *')
			output.write('\n\ndef run():\n')
		elif ind != 1:
			output.write('\t'+line+'\n')
		ind+=1

	output.write('\treturn play_and_code_spring2020_cse323_final_project')
	output.close()
	read_module.close()



	