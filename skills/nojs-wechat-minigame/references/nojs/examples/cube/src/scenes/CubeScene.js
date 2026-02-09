import ThreeScene from './ThreeScene';
import * as THREE from 'three';
import Logger from '../utils/Logger';

/**
 * 魔方主场景 - 展示一个匀速旋转的3D魔方
 * 特性：
 * - 3x3x3 魔方自动旋转
 * - 支持上下/左右滑动调整视角
 * - 梦幻太空背景
 */
class CubeScene extends ThreeScene {
  constructor() {
    super();
    
    // 魔方组
    this.rubiksCube = null;
    
    // 自动旋转速度（弧度/秒）
    this.autoRotationSpeed = 0.5;
    
    // 触摸交互相关
    this.lastTouchX = 0;
    this.lastTouchY = 0;
    this.isDragging = false;
    
    // 用户控制的旋转偏移量
    this.userRotationX = 0;
    this.userRotationY = 0;
    
    // 背景星空粒子
    this.stars = null;
  }

  onEnter(params) {
    super.onEnter(params);
    
    Logger.info('CubeScene 启动 - 3D魔方场景');
    
    // 调整相机位置，确保魔方完全可见
    this.camera.position.set(0, 0, 8);
    this.camera.lookAt(0, 0, 0);
    
    // 创建梦幻太空背景
    this.createSpaceBackground();
    
    // 创建3x3x3魔方
    this.createRubiksCube();
    
    // 添加环境光和方向光
    this.createLights();
    
    // 添加提示文字
    this.createHint();
  }
  
  /**
   * 创建梦幻太空背景
   */
  createSpaceBackground() {
    // 1. 渐变背景色（从深紫到深蓝）
    this.stage.background = new THREE.Color(0x0a0a2e);
    
    // 2. 创建星空粒子系统
    const starGeometry = new THREE.BufferGeometry();
    const starCount = 2000;
    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);
    
    for (let i = 0; i < starCount; i++) {
      const i3 = i * 3;
      
      // 随机位置（球形分布）
      const radius = 50 + Math.random() * 50;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI;
      
      positions[i3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i3 + 2] = radius * Math.cos(phi);
      
      // 随机颜色（白色、淡蓝、淡紫、淡粉）
      const colorType = Math.random();
      if (colorType < 0.4) {
        // 白色星星
        colors[i3] = 1;
        colors[i3 + 1] = 1;
        colors[i3 + 2] = 1;
      } else if (colorType < 0.6) {
        // 淡蓝色
        colors[i3] = 0.7;
        colors[i3 + 1] = 0.9;
        colors[i3 + 2] = 1;
      } else if (colorType < 0.8) {
        // 淡紫色
        colors[i3] = 0.9;
        colors[i3 + 1] = 0.7;
        colors[i3 + 2] = 1;
      } else {
        // 淡粉色
        colors[i3] = 1;
        colors[i3 + 1] = 0.8;
        colors[i3 + 2] = 0.9;
      }
    }
    
    starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    
    const starMaterial = new THREE.PointsMaterial({
      size: 0.3,
      vertexColors: true,
      transparent: true,
      opacity: 0.8,
      sizeAttenuation: true
    });
    
    this.stars = new THREE.Points(starGeometry, starMaterial);
    this.stage.add(this.stars);
  }
  
  /**
   * 创建3x3x3魔方
   */
  createRubiksCube() {
    this.rubiksCube = new THREE.Group();
    
    // 魔方尺寸参数
    const cubeSize = 0.95; // 单个小立方体边长
    const gap = 0.05; // 立方体间隙
    const step = cubeSize + gap; // 步进距离
    
    // 魔方颜色方案（经典魔方配色）
    const colors = {
      front: 0xff0000,   // 红色
      back: 0xff6600,    // 橙色
      left: 0x0000ff,    // 蓝色
      right: 0x00ff00,   // 绿色
      top: 0xffffff,     // 白色
      bottom: 0xffff00   // 黄色
    };
    
    // 创建27个小立方体（3x3x3）
    for (let x = -1; x <= 1; x++) {
      for (let y = -1; y <= 1; y++) {
        for (let z = -1; z <= 1; z++) {
          // 为每个面创建不同颜色的材质
          const materials = [
            new THREE.MeshLambertMaterial({ color: x === 1 ? colors.right : 0x000000 }), // 右
            new THREE.MeshLambertMaterial({ color: x === -1 ? colors.left : 0x000000 }),  // 左
            new THREE.MeshLambertMaterial({ color: y === 1 ? colors.top : 0x000000 }),    // 上
            new THREE.MeshLambertMaterial({ color: y === -1 ? colors.bottom : 0x000000 }), // 下
            new THREE.MeshLambertMaterial({ color: z === 1 ? colors.front : 0x000000 }),  // 前
            new THREE.MeshLambertMaterial({ color: z === -1 ? colors.back : 0x000000 })   // 后
          ];
          
          const geometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
          const cube = new THREE.Mesh(geometry, materials);
          
          // 设置位置
          cube.position.set(x * step, y * step, z * step);
          
          // 添加边框线
          const edges = new THREE.EdgesGeometry(geometry);
          const line = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x000000, linewidth: 2 })
          );
          cube.add(line);
          
          this.rubiksCube.add(cube);
        }
      }
    }
    
    this.stage.add(this.rubiksCube);
  }
  
  /**
   * 创建灯光
   */
  createLights() {
    // 环境光（柔和的整体照明）
    const ambientLight = new THREE.AmbientLight(0x404040, 1.5);
    this.stage.add(ambientLight);
    
    // 主方向光（从右上方照射）
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    this.stage.add(directionalLight1);
    
    // 辅助方向光（从左下方照射，增加立体感）
    const directionalLight2 = new THREE.DirectionalLight(0x8080ff, 0.4);
    directionalLight2.position.set(-3, -3, -3);
    this.stage.add(directionalLight2);
    
    // 点光源（营造梦幻效果）
    const pointLight = new THREE.PointLight(0xff80ff, 0.6, 50);
    pointLight.position.set(0, 0, 10);
    this.stage.add(pointLight);
  }
  
  /**
   * 创建操作提示
   */
  createHint() {
    const systemInfo = wx.getSystemInfoSync();
    
    const hint = this.createHUDText('滑动屏幕调整视角', {
      fontSize: 20,
      color: '#aaaaaa',
      x: 0,
      y: -systemInfo.screenHeight / 2 + 80
    });
    this.addToHUD(hint);
  }
  
  /**
   * 每帧更新
   */
  update(dt) {
    super.update(dt);
    
    // 自动旋转魔方（匀速）
    if (this.rubiksCube) {
      const deltaRotation = this.autoRotationSpeed * (dt / 1000);
      
      // 组合自动旋转和用户控制的旋转
      this.rubiksCube.rotation.x = Math.PI / 6 + this.userRotationX;
      this.rubiksCube.rotation.y += deltaRotation;
      this.rubiksCube.rotation.y += this.userRotationY * 0.001; // 将用户偏移量应用为微调
    }
    
    // 星空缓慢旋转（营造动感）
    if (this.stars) {
      this.stars.rotation.y += 0.0001 * (dt / 16.67);
      this.stars.rotation.x += 0.00005 * (dt / 16.67);
    }
  }
  
  /**
   * 触摸开始
   */
  onTouchStart(event) {
    const touches = event.touches || event.changedTouches;
    if (touches && touches.length > 0) {
      this.isDragging = true;
      this.lastTouchX = touches[0].clientX || touches[0].pageX || touches[0].x;
      this.lastTouchY = touches[0].clientY || touches[0].pageY || touches[0].y;
    }
  }
  
  /**
   * 触摸移动 - 调整视角
   */
  onTouchMove(event) {
    const touches = event.touches || event.changedTouches;
    if (!this.isDragging || !touches || touches.length === 0) {
      return;
    }
    
    const touch = touches[0];
    const currentX = touch.clientX || touch.pageX || touch.x;
    const currentY = touch.clientY || touch.pageY || touch.y;
    
    const deltaX = currentX - this.lastTouchX;
    const deltaY = currentY - this.lastTouchY;
    
    // 灵敏度调整
    const sensitivity = 0.005;
    
    // 上下滑动控制X轴旋转（俯仰）
    this.userRotationX += deltaY * sensitivity;
    
    // 左右滑动控制Y轴旋转（偏航）
    this.userRotationY += deltaX * sensitivity;
    
    // 限制X轴旋转范围（避免翻转过头）
    this.userRotationX = Math.max(-Math.PI / 3, Math.min(Math.PI / 3, this.userRotationX));
    
    // 更新上次触摸位置
    this.lastTouchX = currentX;
    this.lastTouchY = currentY;
  }
  
  /**
   * 触摸结束
   */
  onTouchEnd(event) {
    this.isDragging = false;
  }
  
  /**
   * 触摸取消
   */
  onTouchCancel(event) {
    this.isDragging = false;
  }
  
  /**
   * 清理资源
   */
  cleanup() {
    super.cleanup();
    
    // 清理魔方
    if (this.rubiksCube) {
      this.rubiksCube.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(material => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      this.stage.remove(this.rubiksCube);
      this.rubiksCube = null;
    }
    
    // 清理星空
    if (this.stars) {
      this.stars.geometry.dispose();
      this.stars.material.dispose();
      this.stage.remove(this.stars);
      this.stars = null;
    }
    
    Logger.info('CubeScene 资源已清理');
  }
}

export default CubeScene;
