# WebHooks service

See test run charts [here](https://serob.github.io/WebHooks_test_run/)

////
The main idea of the work is follows: there are two queues in *webHooksContainer.js*:
1. *lowOrderQueue* - every hook is stored in  this queue when it arrived to the server for the first time.
2. *highOrderQueue* - this one is for failed requests which need to be resend. If this queue is not empty, then, on choosing which stored requests need to be sent, priority will be given to it. 

### Internal dependencies

![Alt text](https://image.ibb.co/hJK7kw/Webhooks_dependency.png?raw=true "Dependency")
