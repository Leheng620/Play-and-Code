import sys, json, os, parse_lines

data = sys.stdin.readlines()
data_str = ''
for line in data:
	data_str += line


parse_lines.main(data_str)
import code_runner
print(code_runner.run())
# sys.stdout.flush()
# print(os.path.abspath(os.path.realpath(__file__)).rfind('test.py'))
# os.system('python parse_lines.py')
#os.system('code_runner.py ')