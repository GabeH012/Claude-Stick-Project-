# Shot list = the whole video. One S(...) per shot, in order. build_shots.py finds each phrase in work/words.json
# and writes src/bean/shots.json (python -I -X utf8 work/build_shots.py work/words.json src/bean/shots.json <voice seconds>).
#
# S("phrase where the shot starts", type, **props)   type: "stage" | "card" | "split"
#   Any string prop "@phrase" -> the time that phrase starts, "@>phrase" -> the time it ends, "+1.2" -> shot start + 1.2 s.
#   off=-0.3 nudges the cut earlier/later. Use "end:phrase" as the first argument to cut right after a phrase.
# stage: set, v (variant), cam=dict(z=[from,to] zoom, f=[x,y] focus 0..1, pan=[dx0,dx1], shake=time), blur, dark,
#        place (yellow location tag), label (building sign on "hq"), chars=[C(...)], props=[P(...)], fg=[P(...)] (drawn last)
#   sets: office (v="night"), garage, keynote (+screen=[P(...)]), datacenter, boardroom (table in front), screens (tv=[4 words]),
#         trading (tick="down"), skyline (v="night"), paper (v="dark"), hq (v="dusk", label=), capitol, bedroom
# C(cast, x, y=900 floor, s=1 (about 410 px tall), expr, armL, armR, look -1..1, lookY, walk=dict(x0,x1,a,b[,y0,y1,steps]),
#   flip, front, holdR/holdL/holdBox=P(...), k=[dict(t="@phrase", expr=..., armR=...)] (changes over time), talk=True (mouth flaps))
#   cast: exec, execMid, execYoung, cof1, cof2, suitA..suitD, woman, kid, eng, eng2, worker, rival, tech, tech2, reporter, reporter2, shadow, host
#   expr: calm neutral smile happy shock panic worried angry think smug sad
#   arms: down hips point pointUp wave up hold shrug chin phone box reach
# P(kind, x, y, s=1, at="@phrase" (pops in), out=time, rot, move=dict(x,y,a,b), grow=dict(s,a,b), front=True, ...kind props)
#   kinds: chip crt money sign calendar chair podium phone doc stamp magnifier lock shield brain globe q box scale hub chart book
#          binoculars door bubble speed bars label subscribe tag crowd rack digits crown mountain truck building stairs note columns counter thought audience
# card: text (words pop in one by one between a and b; wrap key words in *stars* for yellow), chapter=True + num="1" for chapter cards.
# split: panels=[dict(set=..., chars=..., props=...), ...] side by side (each panel shows the middle of its stage).
# Stage units: 1920 x 1080, floor at y 900. Close-up: s=2.3 with y = 470 + 290*s. Keep on-screen words to 2-3.
def S(_phrase, _type, **kw):
    d = dict(at=_phrase, type=_type); d.update(kw); return d
def C(c, x, **kw):
    d = dict(c=c, x=x); d.update(kw); return d
def P(kind, x, y, **kw):
    d = dict(kind=kind, x=x, y=y); d.update(kw); return d
def card(phrase, text, end):
    return S(phrase, "card", text=text, a="+0.1", b=end)
def chapter(phrase, text, num):
    return S(phrase, "card", text=text, chapter=True, num=num)

# Demo: "The Toy Company Everyone Laughed At" (30 s, fictional)
SHOTS = [
    S("In 1999, a tiny toy company", "stage", set="garage", place="1999", cam=dict(z=[1.0, 1.12], f=[0.5, 0.6]),
      chars=[C("woman", 820, s=0.95, expr="worried", look=0.4)],
      props=[P("box", 1180, 900, s=0.9, label="TOYS"), P("crt", 1180, 720, s=0.45, mode="code")]),
    S("one phone, and thirty days", "stage", set="paper", cam=dict(z=[1.0, 1.1], f=[0.5, 0.5]),
      props=[P("calendar", 780, 520, s=1.2, month="DAYS LEFT", **{"from": 30}, to=29, a="@thirty days", b="+2.6"),
             P("money", 1250, 760, s=0.9, n=2), P("label", 1250, 470, text="ALMOST BROKE", size=70, c="#d1262e", at="@money left")]),
    S("Its founder, Maya, had a crazy idea", "stage", set="office", v="night", cam=dict(z=[1.0, 1.12], f=[0.55, 0.45]),
      chars=[C("woman", 720, s=1.0, expr="think", armR="chin", look=0.6, lookY=-1, k=[dict(t="@crazy idea", expr="happy", armR="pointUp")])],
      props=[P("thought", 1260, 330, s=1.0, at="@crazy idea", thoughtChip=True)]),
    S("Instead of selling toys in big stores", "split", panels=[
        dict(set="hq", label="TOY MART", props=[P("label", 960, 170, text="STORES", size=100, c="#fff")]),
        dict(set="paper", props=[P("phone", 960, 560, s=0.9, head="TOYS ONLINE", posts=["order now", "fast delivery"], a="+0.4"),
                                 P("label", 960, 170, text="ONLINE", size=100, c="#2f9a4a", at="@online")])]),
    S("Everyone laughed", "stage", set="boardroom", cam=dict(z=[1.0, 1.1], f=[0.5, 0.5], shake="+0.2"),
      chars=[C("suitA", 600, y=880, s=0.9, expr="happy"), C("suitB", 840, y=880, s=0.9, expr="happy", armL="up"),
             C("suitC", 1080, y=880, s=0.9, expr="smug"), C("suitD", 1320, y=880, s=0.9, expr="happy", armR="point")]),
    S("The giant toy chains had billions", "stage", set="skyline", cam=dict(z=[1.0, 1.08], f=[0.5, 0.5]),
      props=[P("building", 620, 905, label="TOY MART"), P("building", 1300, 905, label="KIDZ CO", a="+0.3", b="+2.0"),
             P("label", 960, 430, text="BILLIONS", size=100, c="#ffd21f", at="@billions")]),
    S("But Maya kept going", "stage", set="paper", cam=dict(z=[1.0, 1.06], f=[0.5, 0.55], pan=[0, -40]),
      props=[P("stairs", 560, 880, n=4, w=200, h=90)],
      chars=[C("woman", 1300, y=790, s=0.6, expr="angry", walk=dict(x0=1300, x1=700, a="+0.0", b="+1.8", y0=790, y1=520, steps=3))]),
    card("Ten years later", "Ten years *later...*", "@>years later"),
    S("the giants were closing their stores", "stage", set="hq", v="dusk", label="TOY MART", cam=dict(z=[1.0, 1.1], f=[0.5, 0.5]),
      props=[P("stamp", 960, 500, front=True, text="CLOSED", a="@closing", size=110)],
      chars=[C("suitB", 1300, y=930, s=0.7, expr="sad", armL="box", armR="box", holdBox=P("box", 0, 0, s=0.9, label="DESK", items=True))]),
    S("And Maya's little company", "stage", set="paper", cam=dict(z=[1.0, 1.1], f=[0.5, 0.5]),
      props=[P("chart", 900, 480, s=0.85, a="+0.2", b="+2.6", label="MAYA'S COMPANY"), P("label", 1450, 300, text="WORTH MORE", size=90, c="#2f9a4a", at="@worth more", rot=-6)],
      chars=[C("woman", 1500, y=960, s=0.8, expr="happy", armL="up", armR="up", front=True)]),
    chapter("So what did she see", "What She Saw", "1"),
]
