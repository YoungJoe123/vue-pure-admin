#!/bin/bash
pnpm run build

# 检查上一个命令的退出状态码
if [ $? -eq 0 ]; then
    echo "build完成，开始上传dist文件到服务器115.191.37.225"
    
    # 使用rsync直接上传，排除live2d-models文件夹
    rsync -av /Users/sunnyzhou/git/quanyouhulian/quanyouhulian-ai/vue-pure-admin/dist/ root@115.191.37.225:/usr/share/nginx/html/admin/
    
    echo "上传115.191.37.225完成"

    # 远程重启nginx服务
    ssh root@115.191.37.225 'systemctl restart nginx'
    echo "nginx服务已重启"
else
    echo "build失败，上传操作已取消"
fi