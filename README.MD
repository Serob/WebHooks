# WebHooks service

Service for sending bulk hooks to the provided URLs.


## How it works
The main idea of the work is the following: there are two queues in *webHooksContainer.js*:
* *lowOrderQueue* - every hook is stored in  this queue when it arrived to the server for the first time.
* *highOrderQueue* - this one is for failed requests which need to be resend. If this queue is not empty, then, on choosing which requests to send, priority will be given to it (because they were sent and have to be sent again after 10 seconds). Element to this queue will be added after 10 seconds on fail event, and send function will be triggered depending on active  requests count.

With *CHUNK_SIZE* constant and *activeReqCount* variable service controls the count of
sending and storing requests. 

## For testing
There are two files in the *test* folder which can be used for testing purposes:
* *fakeRequest* is a stub for used *request-promise* lib, and its goal is just to answer with rejected or resolved promise (after some time), depending on uri text
* *testServer* is for more realistic tests. You need to send requests to it, and it will answer with 200 or 418 response, again, depending on uri.

[Here](https://serob.github.io/WebHooks_test_run/) you can see how the system behaves when it needs to handle 200 req/s from clients, and make hooks using *fakeRequest*.

### Internal dependencies
The project's structure is not sophisticated, but maybe the drawing of internal dependency tree can give some extra info))).

<sub>*Coloured ones are containers/globals*</sub>

![Alt text](https://image.ibb.co/m4Mvqw/Webhooks_dependency.png?raw=true "Dependency")