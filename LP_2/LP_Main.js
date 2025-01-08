document.addEventListener("DOMContentLoaded", () => {
    const siteUrl = document.getElementById("site-url");
    const siteLogin = document.getElementById("site-login");
    const sitePassword = document.getElementById("site-password");
    const passwordList = document.getElementById("password-list");

    const generatePasswordButton = document.getElementById("generate-password");
    const addPasswordButton = document.getElementById("add-password");

    //Загрузка паролей из localStorage
    function loadPasswords() {
        passwordList.innerHTML = "";
        const passwords = JSON.parse(localStorage.getItem("passwords")) || [];
        passwords.forEach((entry, index) => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>Сайт: ${entry.url}  Логин: ${entry.login}  Пароль: ${entry.password}</span>
                <button onclick="deletePassword(${index})">Delete</button>
            `;
            passwordList.appendChild(listItem);
        });
    }

    //Сохранение нового пароля
    function savePassword() {
        const url = siteUrl.value.trim();
        const login = siteLogin.value.trim();
        const password = sitePassword.value.trim();

        if (!url || !login || !password) {
            alert("Please fill out all fields");
            return;
        }

        const passwords = JSON.parse(localStorage.getItem("passwords")) || [];
        passwords.push({ url, login, password });
        localStorage.setItem("passwords", JSON.stringify(passwords));
        loadPasswords();

        //Очистка полей
        siteUrl.value = "";
        siteLogin.value = "";
        sitePassword.value = "";
    }

    //Генерация пароля
    function generatePassword() {
        const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
        let password = "";
        for (let i = 0; i < 12; i++) {
            password += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        sitePassword.value = password;
    }

    //Удаление пароля
    window.deletePassword = function (index) {
        const passwords = JSON.parse(localStorage.getItem("passwords")) || [];
        passwords.splice(index, 1);
        localStorage.setItem("passwords", JSON.stringify(passwords));
        loadPasswords();
    };

    //События кнопок
    generatePasswordButton.addEventListener("click", generatePassword);
    addPasswordButton.addEventListener("click", savePassword);

    //Инициализация
    loadPasswords();
});
