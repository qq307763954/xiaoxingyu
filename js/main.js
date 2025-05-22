// 小语星应用主要脚本

// 页面导航系统
const AppNavigation = {
    // 页面历史记录
    history: [],
    
    // 主页面
    mainPages: {
        home: "pages/main/home.html",
        report: "pages/main/report.html",
        expert: "pages/main/expert.html",
        system: "pages/main/system.html"
    },
    
    // 认证页面
    authPages: {
        login: "pages/auth/login.html",
        register: "pages/auth/register.html",
        forgot: "pages/auth/forgot.html"
    },
    
    // 其他子页面
    subPages: {
        // 设备相关
        device: "pages/device/device.html",
        pairing: "pages/device/pairing.html",
        
        // 首页子页面
        mood_detail: "pages/home/mood_detail.html",
        training: "pages/home/training.html",
        
        // 记录子页面
        chat_detail: "pages/report/chat_detail.html",
        
        // 系统子页面
        subscription: "pages/system/subscription.html"
    },
    
    // 当前页面
    currentPage: null,
    
    // 导航到指定页面
    navigate(pageKey, isMainPage = false) {
        const pages = isMainPage ? this.mainPages : {...this.authPages, ...this.subPages};
        const pagePath = pages[pageKey];
        
        if (!pagePath) {
            console.error(`页面 ${pageKey} 不存在`);
            return;
        }
        
        // 保存当前页面到历史记录
        if (this.currentPage) {
            this.history.push(this.currentPage);
        }
        
        // 更新当前页面
        this.currentPage = {key: pageKey, path: pagePath};
        
        // 创建全屏展示
        this.showFullscreenMode(pagePath);
    },
    
    // 返回上一页
    goBack() {
        if (this.history.length === 0) {
            // 如果没有历史记录，则关闭全屏模式
            this.closeFullscreenMode();
            return;
        }
        
        // 获取上一页
        const prevPage = this.history.pop();
        this.currentPage = prevPage;
        
        // 更新展示
        document.querySelector('.fullscreen-frame iframe').src = prevPage.path;
    },
    
    // 显示全屏模式
    showFullscreenMode(pagePath) {
        // 如果已存在全屏模式，则更新iframe源
        let fullscreenMode = document.querySelector('.fullscreen-mode');
        
        if (fullscreenMode) {
            document.querySelector('.fullscreen-frame iframe').src = pagePath;
            return;
        }
        
        // 创建全屏模式元素
        fullscreenMode = document.createElement('div');
        fullscreenMode.className = 'fullscreen-mode';
        
        // 创建全屏框架
        const frame = document.createElement('div');
        frame.className = 'fullscreen-frame';
        
        // 创建iframe
        const iframe = document.createElement('iframe');
        iframe.src = pagePath;
        iframe.frameBorder = "0";
        iframe.width = "100%";
        iframe.height = "100%";
        
        // 创建返回按钮
        const backBtn = document.createElement('div');
        backBtn.className = 'back-btn';
        backBtn.innerHTML = '<i class="fas fa-arrow-left"></i>';
        backBtn.addEventListener('click', () => this.goBack());
        
        // 创建底部导航栏
        const navBar = this.createNavigationBar();
        
        // 组装全屏模式
        frame.appendChild(iframe);
        fullscreenMode.appendChild(frame);
        fullscreenMode.appendChild(backBtn);
        fullscreenMode.appendChild(navBar);
        
        // 添加到页面
        document.body.appendChild(fullscreenMode);
        
        // 禁止页面滚动
        document.body.style.overflow = 'hidden';
    },
    
    // 创建导航栏
    createNavigationBar() {
        const navBar = document.createElement('div');
        navBar.className = 'navigation-overlay';
        
        // 定义导航项
        const navItems = [
            { key: 'home', icon: 'fas fa-home', text: '首页' },
            { key: 'report', icon: 'fas fa-chart-bar', text: '记录' },
            { key: 'expert', icon: 'fas fa-user-md', text: '专家' },
            { key: 'system', icon: 'fas fa-user-circle', text: '我的' }
        ];
        
        // 创建导航按钮
        navItems.forEach(item => {
            const navBtn = document.createElement('div');
            navBtn.className = `overlay-btn ${this.currentPage && this.currentPage.key === item.key ? 'active' : ''}`;
            navBtn.innerHTML = `
                <i class="${item.icon} overlay-icon"></i>
                <span>${item.text}</span>
            `;
            
            // 添加点击事件
            navBtn.addEventListener('click', () => {
                this.navigate(item.key, true);
                
                // 更新活动状态
                document.querySelectorAll('.overlay-btn').forEach(btn => btn.classList.remove('active'));
                navBtn.classList.add('active');
            });
            
            navBar.appendChild(navBtn);
        });
        
        return navBar;
    },
    
    // 关闭全屏模式
    closeFullscreenMode() {
        const fullscreenMode = document.querySelector('.fullscreen-mode');
        if (fullscreenMode) {
            fullscreenMode.remove();
            
            // 恢复页面滚动
            document.body.style.overflow = 'auto';
            
            // 清空历史和当前页面
            this.history = [];
            this.currentPage = null;
        }
    }
};

// 公共的显示/隐藏切换函数
function toggleElementVisibility(btnId, containerId) {
    const btn = document.getElementById(btnId);
    const container = document.getElementById(containerId);
    if (btn && container) {
        container.classList.toggle('hidden');
        btn.textContent = container.classList.contains('hidden') ? '显示' : '隐藏';
    } else {
        console.error(`无法找到元素: 按钮ID=${btnId}, 容器ID=${containerId}`);
    }
}

// 在文档加载完成后初始化交互功能
document.addEventListener('DOMContentLoaded', function() {
    // // 为每个原型框架添加"体验"按钮
    // const containers = document.querySelectorAll('.prototype-container');
    
    // containers.forEach(container => {
    //     // 获取iframe的src
    //     const iframe = container.querySelector('.prototype-frame iframe');
    //     if (!iframe) return;
        
    //     const src = iframe.getAttribute('src');
    //     // 提取页面键名
    //     const pathParts = src.split('/');
    //     const fileName = pathParts[pathParts.length - 1].split('.')[0];
        
    //     // 创建体验按钮
    //     const experienceBtn = document.createElement('button');
    //     experienceBtn.className = 'experience-btn';
    //     experienceBtn.textContent = '立即体验';
        
    //     // 为按钮添加点击事件
    //     experienceBtn.addEventListener('click', function() {
    //         // 确定页面类型
    //         const pageType = pathParts[1]; // auth, main, home, etc.
    //         const isMainPage = pageType === 'main';
            
    //         // 导航到相应页面
    //         AppNavigation.navigate(fileName, isMainPage);
    //     });
        
    //     // 将按钮添加到容器中
    //     container.querySelector('.prototype-frame').appendChild(experienceBtn);
    // });
});