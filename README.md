# Touchless
## About
Webapp that uses machine learning hand gesture recognition to allow for touchless menu ordering. This allows for safe use of fast food and similar restaurants during the COVID pandemic. We collected thousands of pictures of different handgestures then trained and deployed a neural network to a menu UI in react.

## Tech
 - Tensorflow: training the neural network.
 - Roboflow: managing collected data including adding augmentations to vary the data more.
 - Tensorflow.JS: deploying the neural network to the webapp.
 - React.JS: designign the webapp to accept hand gestures using the webcam and manipulate the menu accordingly.
