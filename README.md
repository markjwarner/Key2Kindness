# Key2Kindness Project
This platform was developed as part of a research project aimed to understand how different design choices in the development of proactive moderation "nudges" impacts on their effectiveness. We explored these nudges in two social environments, Twitter (now 'X'), and WhatsApp. The platform runs in the users mobile browsers, and uses a keyboard that can be modified to react to a toxicity model (Perspective API). The platform logs user interaction data into a MongoDB database through a RESTful API (key2kindness_toxicity_REST_API).

## Key2Kindness Platform (key2kindness-platform)
The platform was built using React and Node.js. It mimics two social platforms, WhatsApp, and Twitter (now 'X'). It allows for threads to be embedded, and both contain an in-build web mobile keyboard that can be manipulated is respose to a toxicity model (key2kindness_toxicity_REST_API). 

## Key2Kindness Toxicity REST API (key2kindness_toxicity_REST_API)
This is a RESTful API built on Node.js and MongoDB. It is for the social research study platform key2kindness. Mongodb is required to be installed for this to work. 