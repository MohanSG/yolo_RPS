# Rock Paper Scissors with YOLO object detection
A simple Rock Paper Scissors implementation using YOLOv11 object detection to detect hand signs.

## How it works
<p>The model was trained with over 3000 pre-labeled images produced as a part of the worlds largest game of rock paper scissors
<a href="https://universe.roboflow.com/roboflow-58fyf/rock-paper-scissors-sxsw">Link to dataset</a></p>
<img width="1544" height="365" alt="Screenshot 2025-11-26 141120" src="https://github.com/user-attachments/assets/c8c08d7e-779e-42ba-81ef-aa011a22a9bd" />
<p></p>The model was trained in google colabs using ultralytics 
<a href="https://colab.research.google.com/drive/1mQSJfLEFRHORPp5o7ZXmaMH6ZPcpxS6d?usp=sharing">Link to colab notebook</a></p>
<img width="1820" height="340" alt="Screenshot 2025-11-26 141206" src="https://github.com/user-attachments/assets/e092b827-b3be-46f4-9539-9d7e8962f063" />

<p>I then made a short demo on hugging spaces to help visualize the output and draw bounding boxes around the detected object (either rock, paper or scissors)
You can find the demo <a href="https://huggingface.co/spaces/DKSparda/yolo_space">here</a></p>
<img width="951" height="517" alt="Screenshot 2025-11-26 141414" src="https://github.com/user-attachments/assets/798a3b86-9286-4252-a8aa-46b1c2b4c9e1" />

<p>The model is very accurate at detecting hand signs as long as the image is well lit. It can also recognize different angles and sizes with good accuracy.
As you can tell, this is a very simple implementation, I will speak on some limitations later but I'm currently working on very limited hardware with no GPU, which makes inference extremely slow for real time video.
Because of this, I decided to capture a single frame and run inference on this instead of 20-30 frames per second.</p>

<img alt="paper"  height="180" src="https://github.com/user-attachments/assets/3b8b797f-4809-4609-9c79-ff966e5491c9"/>
<img alt="rock"  height="180" src="https://github.com/user-attachments/assets/84e60cdf-c8b9-46ea-b7b9-6f9939249bce"/>
<img alt="scissors"  height="180" src="https://github.com/user-attachments/assets/44006ee5-2fa1-4a54-8453-b670d91939c7"/>


<p>As for the final application, I went with a website using expressjs for the back end. When an inference needs to be made, the API endpoint is called from hugging spaces, which returns a JSON object
  including a class id, class name, confidence and bounding box xyxy values if bounding boxes are needed.
</p>
<img width="1919" height="916" alt="Screenshot 2025-11-26 152430" src="https://github.com/user-attachments/assets/567cc811-19a7-41c7-9054-90737f186f20" />
<img width="1916" height="911" alt="Screenshot 2025-11-26 152451" src="https://github.com/user-attachments/assets/48ef3caf-4edd-40b1-8ad1-1bef57b2314c" />
