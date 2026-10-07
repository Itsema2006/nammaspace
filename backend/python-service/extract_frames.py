import cv2
import os
import math

def extract_frames_with_metrics(video_path: str, output_dir: str, fps: int = 2) -> dict:
    """
    Extracts frames from a video file at a specified FPS.
    Returns extracted frame count and capture quality metrics.
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
    if original_fps is None or not math.isfinite(original_fps) or original_fps <= 0 or original_fps > 120:
        original_fps = 30.0
    
    # Calculate the interval to skip frames based on desired FPS
    frame_interval = int(original_fps / fps)
    if frame_interval < 1:
        frame_interval = 1
        
    print(f"[OpenCV] Original FPS: {original_fps}, Target FPS: {fps}, Interval: {frame_interval}")

    count = 0
    extracted_count = 0
    candidate_count = 0
    blurred_count = 0
    duplicate_count = 0
    sharpness_values = []
    motion_values = []
    previous_gray = None
    success, image = vidcap.read()
    
    while success:
        if count % frame_interval == 0:
            candidate_count += 1
            gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
            small_gray = cv2.resize(gray, (64, 64))
            sharpness = float(cv2.Laplacian(gray, cv2.CV_64F).var())
            sharpness_values.append(sharpness)
            if previous_gray is not None:
                motion_values.append(float(cv2.absdiff(small_gray, previous_gray).mean()))
            previous_gray = small_gray

            if sharpness < 60:
                blurred_count += 1
                success, image = vidcap.read()
                count += 1
                continue
            if extracted_count and motion_values and motion_values[-1] < 2.0:
                duplicate_count += 1
                success, image = vidcap.read()
                count += 1
                continue

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
    average_motion = sum(motion_values) / len(motion_values) if motion_values else 0.0
    return {
        "frameCount": extracted_count,
        "candidateCount": candidate_count,
        "blurredCount": blurred_count,
        "duplicateCount": duplicate_count,
        "averageMotion": round(average_motion, 3),
        "medianSharpness": round(float(__import__('statistics').median(sharpness_values)), 3) if sharpness_values else 0.0,
        "overlapWarning": extracted_count < 8 or average_motion < 2.0,
    }


def extract_frames_from_video(video_path: str, output_dir: str, fps: int = 2) -> int:
    return extract_frames_with_metrics(video_path, output_dir, fps)["frameCount"]
