let customerCount = 0; // Biến toàn cục để đếm số lượng khách hàng đã đánh giá
let ratingTimeout; // Biến để lưu timeout cho đánh giá
let lastRating; // Biến để lưu đánh giá cuối cùng

// Hàm chọn phòng
function selectRoom(room) {
    // Xóa class "selected" khỏi tất cả các phòng
    document.querySelectorAll('.doctor-box').forEach(box => {
        box.classList.remove('selected');
    });

    // Thêm class "selected" vào phòng được chọn
    document.getElementById(room + '-box').classList.add('selected');
    // Gán giá trị phòng đã chọn vào biến toàn cục
    window.selectedRoom = room;
}

// Hiển thị câu cảm ơn sau khi đánh giá và đặt lại giao diện sau 10s
function submitRating(rating) {
    const thankYouMessage = document.getElementById('thank-you-message');
    const selectedRoom = window.selectedRoom || 'Đánh giá chung'; // Nếu không chọn phòng thì gán là "Đánh giá chung"
    const now = new Date(); // Lấy thời gian hiện tại
    const date = now.toISOString().split('T')[0]; // Lấy ngày
    const time = now.toTimeString().split(' ')[0]; // Lấy giờ

    // Lời cảm ơn tùy chỉnh theo đánh giá
    if (rating === 'Rất hài lòng') {
        thankYouMessage.textContent = 'Cảm ơn Quý khách đã dành lời khen tuyệt vời!';
    } else if (rating === 'Hài lòng') {
        thankYouMessage.textContent = 'Cảm ơn Quý khách! Chúng tôi rất vui vì đã phục vụ tốt.';
    } else if (rating === 'Bình thường') {
        thankYouMessage.textContent = 'Cảm ơn Quý khách! Chúng tôi sẽ cải thiện dịch vụ.';
    } else if (rating === 'Không hài lòng') {
        thankYouMessage.textContent = 'Cảm ơn Quý khách! Chúng tôi xin lỗi và sẽ cải thiện.';
    } else if (rating === 'Rất không hài lòng') {
        thankYouMessage.textContent = 'Chúng tôi thành thật xin lỗi! Mong Quý khách thông cảm.';
    }

    // Hiển thị lời cảm ơn
    thankYouMessage.style.display = 'block';

    // Gửi đánh giá đến Sheety API
    lastRating = rating; // Lưu đánh giá cuối cùng
    clearTimeout(ratingTimeout); // Hủy bỏ timeout trước đó
    ratingTimeout = setTimeout(() => {
        submitToSheety(lastRating, selectedRoom, date, time); // Gửi đánh giá cuối cùng sau 3 giây
        setTimeout(resetInterface, 4000); // Giữ màn hình từ giây thứ 4 đến giây thứ 10
    }, 3000);
}

// Hàm gửi dữ liệu đánh giá đến Sheety API
function submitToSheety(rating, room, date, time) {
    const url = 'https://api.sheety.co/1cd6d7136af968d77d4a2cf984151456/review/review';
    
    // Đổi tên phòng theo lựa chọn
    let roomName;
    if (room === 'room1') {
        roomName = 'Phòng siêu âm 2D-4D';
    } else if (room === 'room2') {
        roomName = 'Phòng siêu âm 5D';
    } else if (room === 'room3') {
        roomName = 'Phòng khám thủ thuật';
    } else {
        roomName = 'Đánh giá chung'; // Nếu không chọn phòng
    }

    const data = {
        review: {
            rating: rating,
            room: roomName, // Sử dụng tên phòng đã đổi
            date: date, // Gửi ngày đánh giá
            time: time, // Gửi giờ đánh giá
            id: ++customerCount // Tăng số thứ tự mỗi khi có đánh giá mới
        }
    };

    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

// Hàm đặt lại giao diện về trạng thái ban đầu
function resetInterface() {
    document.getElementById('thank-you-message').style.display = 'none';
    
    // Xóa class "selected" khỏi tất cả các phòng
    document.querySelectorAll('.doctor-box').forEach(box => {
        box.classList.remove('selected');
    });

    // Xóa giá trị phòng đã chọn
    window.selectedRoom = null;
}
