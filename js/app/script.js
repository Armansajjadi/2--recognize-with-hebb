let weights = []

let b = null

window.addEventListener("load", () => {
    focused(); // فراخوانی تابع مربوط به تمرکز صفحه یا هر عملیاتی که مد نظر داری

    // تلاش برای بارگیری فایل JSON
    fetch('trainData.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('File not found');
            }
            return response.json();
        })
        .then(data => {
            // اگر فایل پیدا شد و داده‌ها بارگذاری شدند
            console.log("Data exists, returning 1");
            console.log("Weights:", data.weights);
            console.log("b:", data.b);

            // داده‌ها را به متغیرها اختصاص بده
            weights = data.weights;
            b = data.b;

            // تغییر نمایش دکمه‌ها
            btnsAboutTrainSection.classList.add("hidden");
            btnSecSabt.classList.remove("hidden");
        })
        .catch(error => {
            // اگر فایل JSON پیدا نشد یا خطایی رخ داد
            console.log("No data found or error occurred, returning 0");
            console.error(error);

            // فراخوانی تابع مقداردهی اولیه یا عملیات مورد نظر
            megdarDehi();
        });
});



function megdarDehi() {
    for (let i = 0; i < 25; i++) {
        weights.push(0)
    }
    b = 0
}

const recognizeBtn = document.getElementById("recognizeBtn")

const btnsAboutTrainSection = document.getElementById("btnsAboutTrainSection")

const doneTrainBtn = document.getElementById("doneTrainBtn")

const btnSecSabt = document.getElementById("btnSecSabt")

let btns = document.querySelectorAll(".btn")

let subO = document.getElementById("subO")
let subX = document.getElementById("subX")

function focused() {
    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.id == "onactive") {
                btn.classList.replace("bg-blue-500", "bg-rose-500")
                btn.classList.replace("hover:bg-blue-700", "hover:bg-rose-700")
                btn.id = "active"
            }
            else if (btn.id == "active") {
                btn.classList.replace("bg-rose-500", "bg-blue-500")
                btn.classList.replace("hover:bg-rose-700", "hover:bg-blue-700")
                btn.id = "onactive"
            }
        })
    })
}

subO.addEventListener("click", () => {
    saveMatrix(-1)
})

subX.addEventListener("click", () => {
    saveMatrix(+1)
})


function saveMatrix(marker) {
    let data = [];

    btns.forEach(btn => {
        if (btn.id === "active") {
            data.push(1); // دکمه فعال
        } else {
            data.push(-1); // دکمه غیرفعال
        }
    });

    train(data, marker)

    btns.forEach(btn => {
        if (btn.id == "active") {
            btn.classList.replace("bg-rose-500", "bg-blue-500")
            btn.classList.replace("hover:bg-rose-700", "hover:bg-blue-700")
            btn.id = "onactive"
        }
    })

}

function train(data, y) {
    let i = 0
    data.forEach((x) => {
        weights[i] += x * y
        i++;
    });
    b += y;

    if (y == +1) {
        alert("trained as X")
    } else {
        alert("trained as O")
    }
}

doneTrainBtn.addEventListener("click", () => {
    btnsAboutTrainSection.classList.add("hidden");
    btnSecSabt.classList.remove("hidden");

    // ساختن شیء داده‌ها
    const data = {
        weights: weights,
        b: b
    };

    // تبدیل داده‌ها به JSON
    const jsonData = JSON.stringify(data);

    // ساخت Blob برای ذخیره داده‌های JSON در یک فایل
    const blob = new Blob([jsonData], { type: 'application/json' });

    // ایجاد یک URL برای فایل Blob
    const url = URL.createObjectURL(blob);

    // ایجاد یک عنصر <a> برای دانلود فایل JSON
    const a = document.createElement('a');
    a.href = url;
    a.download = 'trainData.json';  // نام فایلی که دانلود می‌شود
    document.body.appendChild(a);
    a.click();

    // حذف لینک از DOM
    document.body.removeChild(a);

    // آزاد کردن URL Object
    URL.revokeObjectURL(url);

    console.log("Data has been saved as JSON file!");
});


recognizeBtn.addEventListener("click", () => {
    console.log('ok');
    let infoes = []
    const flag = Array.from(btns).some(btn => btn.id === "active");
    console.log(flag);
    let index = 0
    let netInput = null
    let sum = 0
    if (flag) {
        btns.forEach(btn => {
            if (btn.id === "active") {
                infoes.push(1); // دکمه فعال
            } else {
                infoes.push(-1); // دکمه غیرفعال
            }
        })
        infoes.forEach(info => {
            sum += weights[index] * info
            index++
        })
        netInput = b + sum
        if (netInput >= 0) {
            alert("it is a X")
        } else {
            alert("it is a O")
        }
        btns.forEach(btn => {
            if (btn.id == "active") {
                btn.classList.replace("bg-rose-500", "bg-blue-500")
                btn.classList.replace("hover:bg-rose-700", "hover:bg-blue-700")
                btn.id = "onactive"
            }
        })
    } else {
        alert("you should make a X or O first")
    }
})

