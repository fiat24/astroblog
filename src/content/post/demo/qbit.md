---
title: "关于qBittorrent的部署"
description: "This post showcases using the markdown admonition feature in Astro Cactus"
publishDate: "12 May 2025"
tags: ["qBittorrent", "Alist"]
---
## 1.安装qBittorrent

Debian：

```
apt update
apt install -y qbittorrent-nox
```
CentOS
```
yum install -y qbittorrent-nox
```

## 2.启动qBittorrent
带端口启动web面板（默认是8080，容易冲突）

```
qbittorrent-nox --webui-port=1145
```
后台启动运行
```
 qbittorrent-nox -d
```
 查看版本
 ```
 qbittorrent-nox -v
 ```
 ![image.png](https://roim-picx-9nr.pages.dev/rest/8vshySK.png)
 （用apt和yum安装的版本有点低，不过无所谓了，懒)

 ## 3.访问面板端
 根据终端的输出信息访问面板
 ![image.png](https://roim-picx-9nr.pages.dev/rest/zeS7ySK.png)
 好，进来了（别跟我说你没开放端口）
 ![image.png](https://roim-picx-9nr.pages.dev/rest/IL8IySK.png)
 改个密码先：
![image.png](https://roim-picx-9nr.pages.dev/rest/XTk8ySK.png)
开个无痕窗口测试一下：
![image.png](https://roim-picx-9nr.pages.dev/rest/x4z8ySK.png)
成功用新密码登录，修改成功力！

## 4.设置开机自启

```
vi  /etc/systemd/system/qbittorrent-nox.service
```
把这段粘贴进去：
```
    [Unit]
    
    Description=qBittorrent-nox
    
    After=network.target
     
    [Service]
    
    User=root
    
    Type=forking
    
    RemainAfterExit=yes
    
    ExecStart=/usr/bin/qbittorrent-nox -d
   
    [Install]
    
    WantedBy=multi-user.target
```
然后:wq保存退出
- 为了让 systemd 服务能够正常启动，需要先终止当前运行的 qbittorrent-nox 进程
查看一下进程
```
ps aux | grep qbittorrent-nox
```
可以看到进程PID为 3198299 的 qbittorrent-nox -d 正在运行
```
root     3198299  0.2  1.9 906260 48272 ?        Ssl  01:04   0:04 qbittorrent-nox -d
root     3211211  0.0  0.0   6464  2148 pts/1    S+   01:30   0:00 grep qbittorrent-nox
```
先kill一下
```
sudo kill -9 3198299

```
然后确认一下是不是真杀死了,输出中应该只有 grep qbittorrent-nox 相关的行，没有其他 qbittorrent-nox 进程
```
ps aux | grep qbittorrent-nox
```
这下可以启动了
```
systemctl start qbittorrent-nox 
systemctl enable qbittorrent-nox
```
看看设置成功了没,显示enable就是已设置为开机自启动
```
sudo systemctl status qbittorrent-nox.service
```
![image.png](https://roim-picx-9nr.pages.dev/rest/ZCUlySK.png)
更简洁的查看方式

```
sudo systemctl is-enabled qbittorrent-nox.service
```
![image.png](https://roim-picx-9nr.pages.dev/rest/PLVMySK.png)
## 5.卸载qbittorrent
我就不演示了（

```
# 停止服务
sudo systemctl stop qbittorrent-nox.service

# 禁用服务
sudo systemctl disable qbittorrent-nox.service

# 卸载 qbittorrent-nox 并删除配置文件
sudo apt purge -y qbittorrent-nox

# 清理残留依赖
sudo apt autoremove -y

# 删除 systemd 服务文件
sudo rm /etc/systemd/system/qbittorrent-nox.service
sudo systemctl daemon-reload
```
## 6.关于Tracker
不配置的话一些较为冷门的资源没下载速度
添加方式（把链接丢进去然后点击保存就行了，每行一个）：
![image.png](https://roim-picx-9nr.pages.dev/rest/Ql3nySK.png)
如何获取tracker链接：
https://github.com/XIU2/TrackersListCollection/blob/master/README-ZH.md

下个电影试试，速度还是不错的哈。

![image.png](https://roim-picx-9nr.pages.dev/rest/y0BPySK.png)
都说到这里了，那就顺手挂个Alist吧。存储选择“本机存储”，挂载路径随便取个名字就行，然后根文件夹路径就是qbit下载的位置，默认是/root/Downloads/
![image.png](https://roim-picx-9nr.pages.dev/rest/AcqQySK.png)
现在你就获得了一个免费的磁力观影工具，可以告别吸血迅雷了!
![image.png](https://roim-picx-9nr.pages.dev/rest/engRySK.png)

