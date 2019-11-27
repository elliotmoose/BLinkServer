#!/usr/bin/env python3
'''
usage: python filename.py image_path 
output: image with label
		json txt output

Update json_path inside main()

'''

import face_recognition
import json
import numpy as np
from PIL import Image, ImageDraw
# from IPython.display import display
import matplotlib.pyplot as plt
import argparse 

def getKey( img_dict, value ):
	for i in img_dict:
		if np.array_equal(img_dict[i], value):
			return i

def argParser(): # arg parser
	parser = argparse.ArgumentParser(description ="Process image path")
	parser.add_argument('image_path', type=str, help='Input path of the selfie')
	parser.add_argument('library_path', type=str, help='Input path of the face encodings library')

	return parser.parse_args()

def jsonPrint(connector_ls):
	json_arr = []
	idx = 1
	for person1 in connector_ls[:len(connector_ls)-1]:
		for person2 in connector_ls[idx:]:
			json_arr.append([person1,person2])
		idx+=1
	print(json_arr)



def main():

	face_thresshold = 6/10 # perectage of the largest face image
	connector_ls = [] #list of touple of (face_side, name)
	user_reg_ls = [] # final user out list

	arg=argParser()
	library_path = arg.library_path

	#load image
	# image compression to 50%
	image = Image.open(arg.image_path)
	width, height = image.size
	image = image.resize((width//2, height//2))
	selfie_img = np.array(image)

	# selfie_img = face_recognition.load_image_file(arg.image_path) old
	face_locations = face_recognition.face_locations(selfie_img)
	face_encodings = face_recognition.face_encodings(selfie_img, face_locations)

	# Convert the image to a PIL-format image so that we can draw on top of it with the Pillow library
	pil_img = Image.fromarray(selfie_img)
	draw = ImageDraw.Draw(pil_img)

	#get dictionary
	with open(library_path, 'r') as f:
	    json_text = f.read()
	img_dict =  json.loads(json_text)

	for user_name in img_dict:
		img_dict[user_name] = np.array(img_dict[user_name])

	known_face_encodings = list(img_dict.values())	
	# Loop through each face found in the unknown image
	for (top,right,bottom,left), face_encoding in zip(face_locations, face_encodings):		
		matches = face_recognition.compare_faces(known_face_encodings, face_encoding)
		name = "UNKNOWN"
		
		face_distances = face_recognition.face_distance(known_face_encodings, face_encoding)
		best_match_idx = np.argmin(face_distances)
		if matches[best_match_idx]:
			name = getKey(img_dict, known_face_encodings[best_match_idx])
			# connector_ls.append(name) old
			connector_ls.append((abs(top-bottom), name))
		
		# Draw a box around the face using the Pillow module
		draw.rectangle(((left, top), (right, bottom)), outline=(0, 0, 255))

	    # Draw a label with a name below the face
		text_width, text_height = draw.textsize(name)
		draw.rectangle(((left, bottom - text_height - 10), (right, bottom)), fill=(0, 0, 255), outline=(0, 0, 255))
		draw.text((left + 6, bottom - text_height - 5), name, fill=(255, 255, 255, 255))


	# Remove the drawing library from memory as per the Pillow docs
	del draw

	#extract only face with large enough bounding box
	#with respect to the largest face image
	max_face_side = max(connector_ls)[0]
	for face in connector_ls:
		if (face[0] >= max_face_side*(face_thresshold)):
			user_reg_ls.append(face[1])


	# jsonPrint(connector_ls)
	print(json.dumps(user_reg_ls))
	# Display the resulting image UNCOMMENT TO SEE
	# plt.imshow(pil_img)
	# plt.show()

if __name__=='__main__':
    main()