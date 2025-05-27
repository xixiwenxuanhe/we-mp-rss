import uvicorn
import job
from core.config import cfg
import os
if __name__ == '__main__':
    if  cfg.args.job:
        from threading import Thread
        thread = Thread(target=job.start)  # 传入函数名
        thread.start()  # 启动线程
    if cfg.args.init:
        import init_sys as init
        #如果没有用户，就创建一个
        init.init()
        print('初始化完成')
    uvicorn.run("web:app", host="0.0.0.0", port=8001, reload=True,reload_excludes=['static','web_ui'])
    pass