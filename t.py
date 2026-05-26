
def overlay_bgra(dst_bgr, src_bgra, x, y):
    """把 BGRA(src) 贴到 BGR(dst) 的 (x,y) 位置。"""
    h, w = src_bgra.shape[:2]
    H, W = dst_bgr.shape[:2]
    if x < 0 or y < 0 or x + w > W or y + h > H:
        raise ValueError("overlay 越界：请调整位置或缩放 logo")

    roi = dst_bgr[y:y+h, x:x+w]
    bgr = src_bgra[:, :, :3]
    alpha = src_bgra[:, :, 3]

    bg = cv.bitwise_and(roi, roi, mask=cv.bitwise_not(alpha))
    fg = cv.bitwise_and(bgr, bgr, mask=alpha)

    dst_bgr[y:y+h, x:x+w] = cv.add(bg, fg)
    return dst_bgr