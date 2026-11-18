---
id: sigcite2026-tapwebsite
title: SIGCITE 2026 TAP Website Paper Presentation
year: 2026
students: [trung-dao, kelechi-ariwodo, thanh-tran]
instructors: [cengiz-gunay, anca-doloc-mihu]
description: Lightweight and inexpensive interactive programming widgets for providing authentic coding assessment inside your LMS
postDate: 2026-11-14
projects: []
---
### Lightweight and inexpensive interactive programming widgets for providing authentic coding assessment inside your LMS

Cengiz Gunay, Georgia Gwinnett College

_2026 Annual CCSC:Southeastern Conference at East Tennessee State University_

October 23, 2026
---
![](/src/content/slides/sigcite2026-tapwebsite/outreach_repository_architecture.svg) <!-- .element: height="700px" -->
## Teaching programming<br> in the age of AI chatbots

- Students unmotivated
- Tempting to ask chatbot
- Easy to cheat

Solutions:
- Back to pencil and paper?
---
## Do we still need to teach programming?

Computational and algorithmic thinking is still a _fundamental skill_.
<!-- .element: class="fragment" data-fragment-index="1" -->

Can't _validate_ AI solutions without knowing programming fundamentals.
<!-- .element: class="fragment" data-fragment-index="2" -->

But how do we assess _authenticity_?
<!-- .element: class="fragment" data-fragment-index="3" -->

---
## Assessing authentic programming

- IDEs are infused with AI tools
- Online tools and websites offer chat boxes
- Back to pencil and paper?
---
## Typical programming question

What should be in the blank for program to output `1`?
```python
a = ___
if a > 0:
  a += 1
print(a)
```

Does this help?
<!-- .element: class="fragment" data-fragment-index="1" -->
<iframe src="https://brython.info/tests/editor.html?lang=en&code=" width="1200px" height="400px"></iframe>
<!-- .element: class="fragment" data-fragment-index="1" -->
---
## Plain widgets in programming assessments

- Insert `<iframe/>` elements in LMS.
- Customizable started code
- Works in LockDown Browser (by whitelisting source host)
- No ads, no AI, no backend.

_Really, no backend???_
<!-- .element: class="fragment" data-fragment-index="1" -->
---
## How can you run programming widgets without a backend?

Enter _WebAssembly_:
> Code in many languages can be compiled into WASM, to be executed efficient inside the browser sandbox.

Still need a place to host files (e.g. Github Pages), but no need to rent and manage a server.
---
## WASM Demo

<iframe width="1200px" height="600px" src="https://silentspacemarine.com/"></iframe>
---
## Example authentic programming assignment widgets

- Python
- SQL
- Bash
- Javascript
- And more...
---
## Github repo with examples

https://github.com/cengique/lms-coding-widgets

![](images/qrcode-github-repo.png)