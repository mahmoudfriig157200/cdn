document.addEventListener('DOMContentLoaded', function() {
    // العناصر
    const splashScreen = document.getElementById('splash-screen');
    const chatScreen = document.getElementById('chat-screen');
    const offerScreen = document.getElementById('offer-screen');
    const chatMessages = document.getElementById('chat-messages');
    const inputArea = document.getElementById('input-area');
    const userCountElement = document.getElementById('user-count');
    const todayCountElement = document.getElementById('today-count');
    const timerElement = document.getElementById('timer');
    const discountTimerElement = document.getElementById('discount-timer');
    const verifyBtn = document.getElementById('verify-btn');
    
    // الحالة
    let playerId = '';
    let selectedDiamonds = 0;
    let timerInterval;
    let discountInterval;
    
    // الدول
    const countries = {
        'EG': 'مصر', 
        'SA': 'السعودية',
        'DZ': 'الجزائر',
        'MA': 'المغرب',
        'IQ': 'العراق'
    };
    
    // محاكاة الموقع الجغرافي
    const userCountry = countries['EG'] || 'بلدك';
    
    // الإعداد الأولي
    simulateUserCount();
    setTimeout(showNotification, 10000);
    setTimeout(showFlashNotification, 15000);
    
    // بدء شاشة البداية
    setTimeout(() => {
        splashScreen.classList.add('hidden');
        chatScreen.classList.remove('hidden');
        startChat();
    }, 5000);
    
    // مستمعي الأحداث
    verifyBtn.addEventListener('click', function() {
        window.open('https://boo91.xyz/cl/i/7dgedg', '_blank');
    });
    
    // إضافة مستمعي أحداث لأزرار المهام
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('task-btn')) {
            e.target.textContent = 'جاري التحميل...';
            e.target.disabled = true;
            setTimeout(() => {
                e.target.textContent = 'تم الإكمال!';
                e.target.style.backgroundColor = '#00aa55';
            }, 2000);
        }
    });
    
    // الدوال
    function startChat() {
        addBotMessage(`مرحبًا 👋 أنا DiamondGPT - مساعدك الذكي للحصول على دايموند فري فاير 💎 هل تلعب فري فاير؟`);
        
        setTimeout(() => {
            addBotMessage(`لقد ساعدت <strong>${Math.floor(Math.random()*5000)+10}</strong> لاعب في الحصول على دايموند هذا الأسبوع!`);
        }, 9999);
        
        const btnContainer = document.createElement('div');
        btnContainer.className = 'btn-container';
        
        const yesBtn = document.createElement('button');
        yesBtn.className = 'btn btn-yes';
        yesBtn.textContent = '✅ نعم';
        yesBtn.addEventListener('click', handleYesResponse);
        
        const noBtn = document.createElement('button');
        noBtn.className = 'btn btn-no';
        noBtn.textContent = '❌ لا';
        noBtn.addEventListener('click', handleNoResponse);
        
        btnContainer.appendChild(yesBtn);
        btnContainer.appendChild(noBtn);
        inputArea.appendChild(btnContainer);
    }
    
    function handleYesResponse() {
        addUserMessage("نعم");
        clearInputArea();
        
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage(`رائع! يرجى إدخال معرف لاعب فري فاير الخاص بك  ✍️`);
            
            const inputContainer = document.createElement('div');
            
            const inputField = document.createElement('input');
            inputField.type = 'text';
            inputField.className = 'input-field';
            inputField.placeholder = 'أدخل معرف اللاعب ( الصحيح )';
            inputField.maxLength = 15;
            
            const errorMsg = document.createElement('div');
            errorMsg.className = 'error-message hidden';
            
            const submitBtn = document.createElement('button');
            submitBtn.className = 'btn';
            submitBtn.textContent = 'إرسال';
            submitBtn.addEventListener('click', function() {
                const id = inputField.value.trim();
                if (!id || !/^\d{7,15}$/.test(id)) {
                    errorMsg.textContent = "الرجاء إدخال معرف لاعب صحيح";
                    errorMsg.classList.remove('hidden');
                    return;
                }
                playerId = id;
                handlePlayerIdSubmit();
            });
            
            inputContainer.appendChild(inputField);
            inputContainer.appendChild(errorMsg);
            inputContainer.appendChild(submitBtn);
            inputArea.appendChild(inputContainer);
        }, 1500);
    }
    
    function handleNoResponse() {
        addUserMessage("لا");
        clearInputArea();
        
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage("عذرًا، DiamondGPT يعمل فقط للاعبي فري فاير. عد عندما تبدأ اللعب! 😊");
        }, 1500);
    }
    
    function handlePlayerIdSubmit() {
        addUserMessage(playerId);
        clearInputArea();
        
        showTypingIndicator();
        
        setTimeout(() => {
            removeTypingIndicator();
            addBotMessage("كم عدد الجواهر التي تريد توليدها؟");
            
            const btnContainer = document.createElement('div');
            btnContainer.className = 'btn-container';
            
            const diamondOptions = [
                { amount: 110, emoji: '💎' },
                { amount: 310, emoji: '💎💎' },
                { amount: 550, emoji: '💎💎💎' },
                { amount: 1100, emoji: '💎💎💎💎' },
                { amount: 2200, emoji: '💎💎💎💎💎' }
            ];
            
            diamondOptions.forEach(option => {
                const btn = document.createElement('button');
                btn.className = 'btn btn-diamond';
                btn.innerHTML = `${option.amount} ${option.emoji}`;
                btn.addEventListener('click', function() {
                    selectedDiamonds = option.amount;
                    handleDiamondSelection();
                });
                btnContainer.appendChild(btn);
            });
            
            inputArea.appendChild(btnContainer);
        }, 1500);
    }
    
    function handleDiamondSelection() {
        addUserMessage(`${selectedDiamonds} دايموند`);
        clearInputArea();
        
        // محاكاة التقدم
        simulateDiamondGeneration();
    }
    
    function simulateDiamondGeneration() {
        const progressBar = document.createElement('div');
        progressBar.className = 'progress-bar';
        progressBar.innerHTML = `
            <div class="progress-fill"></div>
            <div class="progress-text">0%</div>
        `;
        chatMessages.appendChild(progressBar);
        
        const steps = [
            { text: "جاري الاتصال بسيرفرات فري فاير...", delay: 2000 },
            { text: "جاري التحقق من معرف اللاعب...", delay: 2000 },
            { text: "جاري توليد الجواهر...", delay: 2000 },
            { 
                text: "عذرًا! حسابك غير مؤهل لاستقبال الجواهر.\nجاري محاولة إصلاح المشكلة... يرجى الانتظار.", 
                delay: 3000,
                isError: true 
            }
        ];
        
        let progress = 0;
        const progressInterval = setInterval(() => {
            progress += Math.floor(Math.random() * 15);
            if (progress > 100) progress = 100;
            
            document.querySelector('.progress-fill').style.width = `${progress}%`;
            document.querySelector('.progress-text').textContent = `${progress}%`;
            
            if (progress === 100) {
                clearInterval(progressInterval);
                setTimeout(() => {
                    progressBar.remove();
                }, 1000);
            }
        }, 200);
        
        let cumulativeDelay = 0;
        
        steps.forEach((step, index) => {
            setTimeout(() => {
                const progressStep = document.createElement('div');
                progressStep.className = `progress-step ${step.isError ? 'failed' : ''}`;
                progressStep.textContent = step.text;
                chatMessages.appendChild(progressStep);
                scrollToBottom();
                
                // بعد الخطوة الأخيرة، عرض صفحة العروض
                if (index === steps.length - 1) {
                    setTimeout(() => {
                        chatScreen.classList.add('hidden');
                        offerScreen.classList.remove('hidden');
                        startCountdown();
                    }, 1500);
                }
            }, cumulativeDelay);
            
            cumulativeDelay += step.delay;
        });
    }
    
    function startCountdown() {
        let minutes = 4;
        let seconds = 59;
        
        timerInterval = setInterval(() => {
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(timerInterval);
                    return;
                }
                minutes--;
                seconds = 59;
            } else {
                seconds--;
            }
        }, 1000);
        
        // عد تنازلي للخصم
        let discountMinutes = 4;
        let discountSeconds = 59;
        
        discountInterval = setInterval(() => {
            discountTimerElement.textContent = `${discountMinutes.toString().padStart(2, '0')}:${discountSeconds.toString().padStart(2, '0')}`;
            
            if (discountSeconds === 0) {
                if (discountMinutes === 0) {
                    clearInterval(discountInterval);
                    document.querySelector('.discount-banner').textContent = "⏱ انتهى العرض الخاص!";
                    return;
                }
                discountMinutes--;
                discountSeconds = 59;
            } else {
                discountSeconds--;
            }
        }, 1000);
    }


    
    function simulateUserCount() {

        function getRandomInt(min, max) {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        let randomInt = getRandomInt(210, 820);
        
        let count = randomInt;
        const speed = 60;
        
        setInterval(() => {
            count += Math.floor(Math.random() * 1.1);
            userCountElement.textContent = count.toLocaleString();
        }, speed);
        
        let today = 5327;
        setInterval(() => {
            today += Math.floor(Math.random() * 5);
            todayCountElement.textContent = today.toLocaleString();
        }, speed * 2);
    }
    
    function showNotification() {
        const names = ["أحمد", "محمد", "علي", "يوسف", "مريم", "فاطمة", "خالد"];
        const amounts = [110, 310, 550, 1100, 2200];
        const avatars = ['👦', '👧', '🧑', '👨', '👩', '🧔', '👩‍🦰', '👨‍🦱'];
        
        const randomName = names[Math.floor(Math.random() * names.length)];
        const randomAmount = amounts[Math.floor(Math.random() * amounts.length)];
        const randomAvatar = avatars[Math.floor(Math.random() * avatars.length)];
        
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <span class="avatar">${randomAvatar}</span>
                <span>${randomName} من ${userCountry} حصل للتو على ${randomAmount} دايموند!</span>
            </div>
        `;
        
        document.body.appendChild(notification);
        document.getElementById('notification-sound').cloneNode(true).play();
        
        setTimeout(() => {
            notification.remove();
            // عرض إشعار جديد بعد 15-20 ثانية
            setTimeout(showNotification, 15000 + Math.random() * 5000);
        }, 4000);
    }
    
    function showFlashNotification() {
        const messages = [
            "⚠️ بقي 3 أماكن فقط لـ 2200 دايموند!",
            "🔥 عرض حصري: أكمل المهام بسرعة أكبر اليوم!",
            "🚀 منطقتك لديها معدل نجاح أعلى!"
        ];
        
        const flash = document.createElement('div');
        flash.className = 'flash-notification';
        flash.textContent = messages[Math.floor(Math.random() * messages.length)];
        
        document.body.appendChild(flash);
        setTimeout(() => flash.remove(), 3000);
        
        // عرض إشعار فلاش جديد بعد 20-30 ثانية
        setTimeout(showFlashNotification, 20000 + Math.random() * 10000);
    }
    
    function addBotMessage(text) {
        const message = document.createElement('div');
        message.className = 'message bot-message';
        message.innerHTML = text;
        chatMessages.appendChild(message);
        scrollToBottom();
    }
    
    function addUserMessage(text) {
        const message = document.createElement('div');
        message.className = 'message user-message';
        message.textContent = text;
        chatMessages.appendChild(message);
        scrollToBottom();
    }
    
    function showTypingIndicator() {
        const typing = document.createElement('div');
        typing.className = 'message bot-message typing-indicator';
        typing.id = 'typing-indicator';
        
        for (let i = 0; i < 3; i++) {
            const dot = document.createElement('div');
            dot.className = 'typing-dot';
            typing.appendChild(dot);
        }
        
        chatMessages.appendChild(typing);
        scrollToBottom();
    }
    
    function removeTypingIndicator() {
        const typing = document.getElementById('typing-indicator');
        if (typing) {
            typing.remove();
        }
    }
    
    function clearInputArea() {
        inputArea.innerHTML = '';
    }
    
    function scrollToBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
});