document.getElementById('rsvp-form').addEventListener('submit', function (event) {
    event.preventDefault(); // מונע רענון של הדף

    const phone = document.getElementById('phone').value.trim();
    const guests = document.getElementById('guests').value.trim();
    const responseMessage = document.getElementById('response-message');
    const submitButton = document.querySelector('button[type="submit"]');  // כפתור השליחה

    // אם כבר בוצעה שליחה, מנע שליחה נוספת
    if (submitButton.disabled) {
        return; // יוצא מהפונקציה אם הכפתור מושבת
    }

    // השבתת כפתור השליחה כדי למנוע לחיצה נוספת למשך 10 שניות
    submitButton.disabled = true;
    submitButton.style.backgroundColor = '#ccc'; // שינוי צבע הכפתור כדי להראות שהוא מושבת

    // הצגת הודעת תודה מיידית
    responseMessage.style.color = 'green';
    responseMessage.textContent = "!תודה על המענה, נפגש על הרחבה";
    responseMessage.style.display = 'block';

    // איפוס הודעה קיימת
    setTimeout(() => {
        responseMessage.style.display = 'none';  // מחביא את ההודעה אחרי שהודענו תודה
    }, 2000);  // החביא את ההודעה אחרי 2 שניות

    // בדיקת שדות
    if (!phone) {
        responseMessage.style.color = 'red';
        responseMessage.textContent = "יש להזין מספר פלאפון.";
        responseMessage.style.display = 'block';
        submitButton.disabled = false; // ביטול השבתת כפתור אם יש טעות
        submitButton.style.backgroundColor = '#d4a373'; // החזרת הצבע המקורי
        return;
    }

    if (!guests) {
        responseMessage.style.color = 'red';
        responseMessage.textContent = "יש להזין כמות מגיעים.";
        responseMessage.style.display = 'block';
        submitButton.disabled = false; // ביטול השבתת כפתור אם יש טעות
        submitButton.style.backgroundColor = '#d4a373'; // החזרת הצבע המקורי
        return;
    }

    // שליחת הנתונים ל-Google Sheets דרך ה-Web App
    fetch("https://script.google.com/macros/s/AKfycbwWSHSC0JHS4QHLe2wFTbl5qRD_T58ZlRkXDwrdd9nxzqEjUctlvfKqKEcd_LtK0NSM/exec", {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `phone=${encodeURIComponent(phone)}&guests=${encodeURIComponent(guests)}`,
    })
        .then((response) => response.text())
        .then((data) => {
            if (data === "Success") {
                // עדכון הודעה לאחר שליחה אם הייתה הצלחה
                responseMessage.style.color = 'green';
                responseMessage.textContent = "!תודה על המענה, נפגש על הרחבה";
                responseMessage.style.display = 'block';
            } else {
                // הודעת שגיאה במקרה של כישלון
                responseMessage.style.color = 'red';
                responseMessage.textContent = "אירעה שגיאה. נסה שוב.";
                responseMessage.style.display = 'block';
            }
        })
        .catch((error) => {
            // הודעת שגיאה במקרה של כישלון בשליחה
            responseMessage.style.color = 'red';
            responseMessage.textContent = "אירעה שגיאה. נסה שוב.";
            responseMessage.style.display = 'block';
            console.error('Error:', error);
        })
        .finally(() => {
            // החזרת כפתור השליחה לפעולה לאחר 10 שניות
            setTimeout(() => {
                submitButton.disabled = false;
                submitButton.style.backgroundColor = '#d4a373'; // החזרת הצבע המקורי
            }, 10000); // 10 שניות
        });
});

document.addEventListener("DOMContentLoaded", function() {
    confetti({
        particleCount: 200,  // כמות הנפצים
        spread: 70,          // פיזור הנפצים
        origin: { y: 0.6 },  // המיקום שממנו תצא האנימציה
        colors: ['#dab087', '#f8f0e8', '#f8f0e8', '#25180b', '#9b642f'],  // הצבעים של הנפצים
    });
});
