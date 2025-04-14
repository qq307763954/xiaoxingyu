// 小星语应用组件脚本

// 组件交互系统
const AppComponents = {
    // 初始化所有组件
    init() {
        this.initializeAuthComponents();
        this.initializeDeviceComponents();
        this.initializeHomeComponents();
        this.initializeSystemComponents();
    },
    
    // 认证相关组件
    initializeAuthComponents() {
        // 登录页面组件
        document.addEventListener('navToLogin', () => {
            AppNavigation.navigate('login');
        });
        
        // 注册页面组件
        document.addEventListener('navToRegister', () => {
            AppNavigation.navigate('register');
        });
        
        // 忘记密码页面组件
        document.addEventListener('navToForgot', () => {
            AppNavigation.navigate('forgot');
        });
        
        // 监听登录表单提交
        document.addEventListener('loginSubmit', (event) => {
            const { username, password } = event.detail;
            console.log(`登录: ${username}, ${password}`);
            // 模拟登录成功
            setTimeout(() => {
                AppNavigation.navigate('home', true);
            }, 1000);
        });
        
        // 监听注册表单提交
        document.addEventListener('registerSubmit', (event) => {
            const { username, password, phone } = event.detail;
            console.log(`注册: ${username}, ${password}, ${phone}`);
            // 模拟注册成功
            setTimeout(() => {
                AppNavigation.navigate('login');
            }, 1000);
        });
    },
    
    // 设备相关组件
    initializeDeviceComponents() {
        // 设备连接页面组件
        document.addEventListener('navToDevice', () => {
            AppNavigation.navigate('device');
        });
        
        // 设备配对页面组件
        document.addEventListener('navToPairing', () => {
            AppNavigation.navigate('pairing');
        });
        
        // 监听设备选择
        document.addEventListener('deviceSelected', (event) => {
            const { deviceId } = event.detail;
            console.log(`选择设备: ${deviceId}`);
            // 返回首页
            setTimeout(() => {
                AppNavigation.navigate('home', true);
            }, 800);
        });
        
        // 监听设备配对
        document.addEventListener('devicePaired', (event) => {
            const { deviceId, success } = event.detail;
            console.log(`配对设备: ${deviceId}, 成功: ${success}`);
            if (success) {
                // 配对成功，返回设备页面
                setTimeout(() => {
                    AppNavigation.navigate('device');
                }, 800);
            }
        });
    },
    
    // 首页相关组件
    initializeHomeComponents() {
        // 情绪详情页面组件
        document.addEventListener('navToMoodDetail', () => {
            AppNavigation.navigate('mood_detail');
        });
        
        // 训练页面组件
        document.addEventListener('navToTraining', () => {
            AppNavigation.navigate('training');
        });
        
        // 监听训练完成
        document.addEventListener('trainingCompleted', (event) => {
            const { score, sessionId } = event.detail;
            console.log(`训练完成: 会话 ${sessionId}, 得分 ${score}`);
            // 返回首页
            setTimeout(() => {
                AppNavigation.navigate('home', true);
            }, 1500);
        });
    },
    
    // 系统相关组件
    initializeSystemComponents() {
        // 会员管理页面组件
        document.addEventListener('navToSubscription', () => {
            AppNavigation.navigate('subscription');
        });
        
        // 监听会员订阅
        document.addEventListener('subscriptionChanged', (event) => {
            const { plan, price } = event.detail;
            console.log(`订阅变更: ${plan}, 价格 ${price}`);
            // 返回系统页面
            setTimeout(() => {
                AppNavigation.navigate('system', true);
            }, 800);
        });
    },
    
    // 通用组件交互
    setupComponentInteractions(container) {
        if (!container) return;
        
        // 设置按钮点击事件
        const buttons = container.querySelectorAll('[data-action]');
        buttons.forEach(button => {
            const action = button.dataset.action;
            const target = button.dataset.target;
            
            button.addEventListener('click', () => {
                // 根据action执行相应操作
                switch(action) {
                    case 'navigate':
                        // 检查是否是主导航
                        const isMainNav = button.dataset.main === 'true';
                        AppNavigation.navigate(target, isMainNav);
                        break;
                    case 'back':
                        AppNavigation.goBack();
                        break;
                    case 'close':
                        AppNavigation.closeFullscreenMode();
                        break;
                    default:
                        // 触发自定义事件
                        document.dispatchEvent(new CustomEvent(action, {
                            detail: { target }
                        }));
                }
            });
        });
        
        // 设置表单提交事件
        const forms = container.querySelectorAll('form[data-form]');
        forms.forEach(form => {
            const formType = form.dataset.form;
            
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                
                // 收集表单数据
                const formData = {};
                const inputs = form.querySelectorAll('input, select, textarea');
                inputs.forEach(input => {
                    if (input.name) {
                        formData[input.name] = input.value;
                    }
                });
                
                // 触发相应表单提交事件
                document.dispatchEvent(new CustomEvent(`${formType}Submit`, {
                    detail: formData
                }));
            });
        });
    }
};

// 在文档加载完成后初始化组件
document.addEventListener('DOMContentLoaded', function() {
    AppComponents.init();
    
    // 监听iframe加载事件，为加载的页面设置组件交互
    window.addEventListener('message', function(event) {
        if (event.data === 'iframeLoaded') {
            const iframes = document.querySelectorAll('iframe');
            iframes.forEach(iframe => {
                if (iframe.contentDocument) {
                    AppComponents.setupComponentInteractions(iframe.contentDocument);
                }
            });
        }
    });
}); 