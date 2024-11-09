let weights = []

let b = null

let btns = null

window.addEventListener("load", () => {
    focused(); // فراخوانی تابع مربوط به تمرکز صفحه یا هر عملیاتی که مد نظر داری

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
            test(data.weights, data.b)
        })
        .catch(error => {
            // اگر فایل JSON پیدا نشد یا خطایی رخ داد
            console.log("No data found or error occurred, returning 0");
            console.error(error);


        });
});

function test(ws, bias) {
    let netInput = null
    let sum = 0
    let index = 0
    let javab = 0
    let counter = 0
    fetch("testDataSets.json")
        .then(res => res.json())
        .then(array => {
            array.forEach(item => {
                item.data = item.data.flat();
            });
            array.forEach(item => {
                index = 0
                sum = 0
                item.data.forEach(info => {
                    sum += ws[index] * info
                    index++
                })
                netInput = bias + sum;
                if (netInput >= 0) {
                    javab = 1
                } else if (netInput < 0) {
                    javab = -1
                }
                if (javab == item.y) {
                    counter++
                }
            })
            const accuracyValue = document.getElementById("accuracyValue")
            accuracyValue.innerHTML = `${((counter / array.length) * 100).toFixed(2)}%`

        })
}



const recognizeBtn = document.getElementById("recognizeBtn")

const btnsAboutTrainSection = document.getElementById("btnsAboutTrainSection")

const doneTrainBtn = document.getElementById("doneTrainBtn")

const btnSecSabt = document.getElementById("btnSecSabt")



function focused() {
    const btnContainer = document.getElementById("btnContainer");

    // Generate buttons and set their initial IDs
    for (let i = 0; i < 25; i++) {
        btnContainer.insertAdjacentHTML(
            "beforeend",
            `<button id="onactive" class="btn bg-blue-500 dark:bg-blue-600 hover:bg-blue-700 text-white font-semibold p-8 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"></button>`
        );
    }

    // Select all buttons
    btns = document.querySelectorAll(".btn");

    btns.forEach(btn => {
        btn.addEventListener("click", () => {
            if (btn.id === "onactive") {
                // Change classes for active state
                btn.classList.replace("bg-blue-500", "bg-rose-500");
                btn.classList.replace("dark:bg-blue-600", "dark:bg-rose-700");
                btn.classList.replace("hover:bg-blue-700", "hover:bg-rose-800");
                btn.id = "active"; // Change ID to active
            } else if (btn.id === "active") {
                // Revert classes to inactive state
                btn.classList.replace("bg-rose-500", "bg-blue-500");
                btn.classList.replace("dark:bg-rose-700", "dark:bg-blue-600");
                btn.classList.replace("hover:bg-rose-800", "hover:bg-blue-700");
                btn.id = "onactive"; // Change ID back to onactive
            }
        });
    });
}



doneTrainBtn.addEventListener("click", () => {


    fetch("trainDataSets.json").then(res => res.json()).then(array => {
        for (let j = 0; j < 25; j++) {
            weights.push(0)
        }
        b = 0
        let dataForTrain = array.map(item => ({ ...item, data: item.data.flat() }));
        dataForTrain.forEach(item => {
            item.data.forEach((x, idx) => {
                weights[idx] += x * Number(item.y);
                console.log(item.y);
            })
            b += Number(item.y);
            console.log('object');
        })

        btnsAboutTrainSection.classList.add("hidden");
        btnSecSabt.classList.remove("hidden");

        const data = {
            weights: weights,
            b: b
        };

        const jsonData = JSON.stringify(data);

        const blob = new Blob([jsonData], { type: 'application/json' });

        const url = URL.createObjectURL(blob);

        const a = document.createElement('a');
        a.href = url;
        a.download = 'trainData.json';
        document.body.appendChild(a);
        a.click();

        document.body.removeChild(a);

        URL.revokeObjectURL(url);

        console.log("Data has been saved as JSON file!");


    }).catch(err => console.error(err));


});


recognizeBtn.addEventListener("click", () => {
    let infoes = []
    const flag = Array.from(btns).some(btn => btn.id === "active");
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
                // Revert classes to inactive state
                btn.classList.replace("bg-rose-500", "bg-blue-500");
                btn.classList.replace("dark:bg-rose-700", "dark:bg-blue-600");
                btn.classList.replace("hover:bg-rose-800", "hover:bg-blue-700");
                btn.id = "onactive"; // Change ID back to onactive
            }
        })
    } else {
        alert("you should make a X or O first")
    }
})

