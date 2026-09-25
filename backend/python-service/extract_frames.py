import cv2
import os

def extract_frames_from_video(video_path: str, output_dir: str, fps: int = 2) -> int:
    """
    Extracts frames from a video file at a specified FPS.
    Returns the number of frames extracted.
    """
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)

    print(f"[OpenCV] Opening video file: {video_path}")
    vidcap = cv2.VideoCapture(video_path)
    
    if not vidcap.isOpened():
        print(f"[OpenCV] Error: Could not open video file {video_path}")
        return 0

    # Get the original video framerate
    original_fps = vidcap.get(cv2.CAP_PROP_FPS)
    if original_fps == 0 or original_fps is None:
        original_fps = 30.0 # Default fallback
    
    # Calculate the interval to skip frames based on desired FPS
    frame_interval = int(original_fps / fps)
    if frame_interval < 1:
        frame_interval = 1
        
    print(f"[OpenCV] Original FPS: {original_fps}, Target FPS: {fps}, Interval: {frame_interval}")

    count = 0
    extracted_count = 0
    success, image = vidcap.read()
    
    while success:
        if count % frame_interval == 0:
            frame_filename = os.path.join(output_dir, f"frame_{extracted_count:05d}.jpg")
            # Save the frame in high quality
            cv2.imwrite(frame_filename, image, [int(cv2.IMWRITE_JPEG_QUALITY), 95])
            extracted_count += 1
            
            if extracted_count % 10 == 0:
                print(f"[OpenCV] Extracted {extracted_count} frames so far...")
                
        success, image = vidcap.read()
        count += 1

    vidcap.release()
    print(f"[OpenCV] Finished extraction. Total frames saved: {extracted_count} in {output_dir}")
    return extracted_count
