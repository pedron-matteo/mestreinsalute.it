// Medici Data
const doctorsData = {
    1: {
        name: "Dr.ssa Laura Bergo", phone: "366 7423835", email: "", schedule: [
            { day: "Lunedì", time: "08:30 - 11:30" },
            { day: "Martedì", time: "15:00 - 18:00" },
            { day: "Mercoledì", time: "08:00 - 14:00" },
            { day: "Giovedì", time: "15:00 - 18:00" },
            { day: "Venerdì", time: "08:30 - 11:30" }
        ]
    },
    2: {
        name: "Dr.ssa Silvia Gaburro", phone: "", email: "", schedule: [
            { day: "Lunedì", time: "15:00 - 18:00" },
            { day: "Martedì", time: "08:00 - 14:00" },
            { day: "Mercoledì", time: "09:00 - 12:00" },
            { day: "Giovedì", time: "15:00 - 18:00" },
            { day: "Venerdì", time: "14:30 - 17:30" }
        ]
    },
    3: {
        name: "Dr. Christian Cirone", phone: "351 7753552", email: "", schedule: [
            { day: "Lunedì", time: "08:00 - 11:00" },
            { day: "Martedì", time: "08:00 - 11:00" },
            { day: "Mercoledì", time: "14:20 - 20:00" },
            { day: "Giovedì", time: "13:00 - 15:00" },
            { day: "Venerdì", time: "08:00 - 11:00" }
        ]
    },
    4: {
        name: "Dr.ssa Amany Mohammed", phone: "", email: "", schedule: [
            { day: "Lunedì", time: "16:00 - 20:00" },
            { day: "Martedì", time: "09:00 - 12:00" },
            { day: "Mercoledì", time: "09:00 - 12:00" },
            { day: "Giovedì", time: "09:00 - 12:00" },
            { day: "Venerdì", time: "13:00 - 16:00" }
        ]
    },
    5: {
        name: "Dr. Gilberto Dariol", phone: "327 7484675", email: "", schedule: [
            { day: "Lunedì", time: "15:00 - 18:00" },
            { day: "Martedì", time: "09:00 - 12:00" },
            { day: "Mercoledì", time: "09:00 - 12:00" },
            { day: "Giovedì", time: "14:00 - 20:00" },
            { day: "Venerdì", time: "09:00 - 12:00" }
        ]
    },
    6: {
        name: "Dr. Andrea Ongaro", phone: "338 3727796", email: "", schedule: [
            { day: "Lunedì", time: "15:00 - 18:00" },
            { day: "Martedì", time: "08:00 - 14:00" },
            { day: "Mercoledì", time: "09:00 - 12:00" },
            { day: "Giovedì", time: "15:00 - 18:00" },
            { day: "Venerdì", time: "14:30 - 17:30" }
        ]
    },
    7: {
        name: "Dr.ssa Giulia Perissinotto", phone: "348 7292891", email: "", schedule: [
            { day: "Lunedì", time: "08:30 - 11:30" },
            { day: "Martedì", time: "14:30 - 17:30" },
            { day: "Mercoledì", time: "13:30 - 16:30" },
            { day: "Giovedì", time: "08:00 - 14:00" },
            { day: "Venerdì", time: "08:30 - 11:30" }
        ]
    },
    8: {
        name: "Dr.ssa Sara Congiu", phone: "353 4654971", email: "sara.congiu.doc@gmail.com", schedule: [
            { day: "Lunedì", time: "08:00 - 12:00" },
            { day: "Martedì", time: "09:00 - 12:00" },
            { day: "Mercoledì", time: "15:00 - 18:00" },
            { day: "Giovedì", time: "09:00 - 12:00" },
            { day: "Venerdì", time: "14:00 - 17:00" }
        ]
    },
    9: {
        name: "Dr.ssa Susanna Favarato", phone: "375 5486943", email: "", schedule: [
            { day: "Lunedì", time: "15:00 - 18:00" },
            { day: "Martedì", time: "09:00 - 12:00" },
            { day: "Mercoledì", time: "15:00 - 18:00" },
            { day: "Giovedì", time: "09:00 - 12:00" },
            { day: "Venerdì", time: "08:00 - 14:00" }
        ]
    },
    10: {
        name: "Dr. Jacopo Scaggiante", phone: "371 5763429", email: "", schedule: [
            { day: "Lunedì", time: "09:30 - 12:30" },
            { day: "Martedì", time: "14:00 - 20:00" },
            { day: "Mercoledì", time: "14:30 - 18:30" },
            { day: "Giovedì", time: "09:30 - 12:30" },
            { day: "Venerdì", time: "09:30 - 12:30" }
        ]
    },
};



// Modal Logic
const modal = document.getElementById("doctorModal");
const closeBtn = document.querySelector(".close-modal");
const modalBody = document.getElementById("modalBody");
let currentDoctorId = null;

function getCurrentLang() {
    const saved = localStorage.getItem('siteLang');
    return saved && translations[saved] ? saved : 'it';
}

function t(key, fallback) {
    const lang = getCurrentLang();
    return (translations[lang] && translations[lang][key]) || fallback;
}

function translateDay(day) {
    const dayMap = {
        'Lunedì': t('days.monday', 'Monday'),
        'Martedì': t('days.tuesday', 'Tuesday'),
        'Mercoledì': t('days.wednesday', 'Wednesday'),
        'Giovedì': t('days.thursday', 'Thursday'),
        'Venerdì': t('days.friday', 'Friday')
    };
    return dayMap[day] || day;
}

function openModal(doctorId) {
    const doctor = doctorsData[doctorId];
    if (!doctor) return;
    currentDoctorId = doctorId;

    let scheduleRows = doctor.schedule.map(slot => `
        <tr>
            <td>${translateDay(slot.day)}</td>
            <td>${slot.time}</td>
        </tr>
    `).join('');

    const phoneRow = doctor.phone
        ? `<p><i class="fas fa-phone"></i> <strong>${t('doctors.phone_label', 'Phone')}:</strong> ${doctor.phone}</p>`
        : '';
    const emailRow = doctor.email
        ? `<p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${doctor.email}</p>`
        : '';

    const htmlContent = `
        <div class="modal-header">
            <h2>${doctor.name}</h2>
        </div>
        <div class="modal-body">
            <h3>${t('doctors.modal_schedule_title', 'Office Hours')}</h3>
            <table class="schedule-table">
                <thead>
                    <tr>
                        <th>${t('doctors.modal_day', 'Day')}</th>
                        <th>${t('doctors.modal_time', 'Time')}</th>
                    </tr>
                </thead>
                <tbody>
                    ${scheduleRows}
                </tbody>
            </table>
            
            <div class="contact-info-modal">
                ${phoneRow}
                ${emailRow}
                <p><small>${t('doctors.by_appointment', '* By appointment only')}</small></p>
            </div>
        </div>
    `;

    modalBody.innerHTML = htmlContent;
    modal.style.display = "block";
    document.body.style.overflow = "hidden"; // Prevent background scrolling
}

// Close Modal Events
closeBtn.onclick = function () {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
    currentDoctorId = null;
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = "none";
        document.body.style.overflow = "auto";
        currentDoctorId = null;
    }
}

document.addEventListener('i18n:changed', () => {
    if (modal && modal.style.display === 'block' && currentDoctorId) {
        openModal(currentDoctorId);
    }
});
