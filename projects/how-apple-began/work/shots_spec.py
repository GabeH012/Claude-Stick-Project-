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

# "How Apple Began" (88 s). Founders are drawn as original role characters (visionary / engineer / partner3), never likenesses.
F = lambda c, x, **kw: C(c, x, **kw)
SHOTS = [
    # ---- cold open ----
    S("In 1976, two young men", "stage", set="garage", place="1976", cam=dict(z=[1.0, 1.12], f=[0.5, 0.62]),
      chars=[F("visionary", 760, expr="smile", look=0.5), F("engineer", 1160, expr="think", armR="chin", look=-0.5, k=[dict(t="@idea", expr="happy", armR="pointUp")])],
      props=[P("bulb", 960, 300, s=0.9, at="+0.8")]),
    S("that would eventually change the entire world", "stage", set="skyline", v="night", cam=dict(z=[1.0, 1.1], f=[0.5, 0.5]),
      props=[P("globe", 960, 480, s=1.0, at="+0.1", grow=dict(s=1.25, a="+0.2", b="+2.8")),
             P("label", 960, 880, text="THE ENTIRE WORLD", size=86, c="#ffd21f", at="@entire world")]),
    S("Their names were Steve Jobs", "stage", set="garage", cam=dict(z=[1.0, 1.1], f=[0.5, 0.6]),
      chars=[F("visionary", 600, expr="smug", armL="hips", look=0.3), F("engineer", 1320, expr="happy", armR="wave", look=-0.3)],
      props=[P("tag", 600, 400, s=1.3, at="@Steve Jobs", text="STEVE JOBS"), P("tag", 1320, 400, s=1.3, at="@Wozniak", text="STEVE WOZNIAK")]),
    S("They weren't billionaires", "stage", set="paper", cam=dict(z=[1.0, 1.08], f=[0.5, 0.55]),
      chars=[F("visionary", 1180, expr="neutral", armL="shrug", armR="shrug"), F("engineer", 1460, expr="smile", armL="shrug", armR="shrug")],
      props=[P("money", 560, 760, s=1.1, n=7), P("stamp", 560, 520, text="NOT THEM", size=80, a="@billionaires")]),
    S("They didn't have a huge office", "stage", set="hq", label="BIG CORP", cam=dict(z=[1.0, 1.1], f=[0.5, 0.6]),
      chars=[F("visionary", 1350, y=960, s=0.55, expr="worried", look=-0.6, lookY=-1), F("engineer", 1500, y=960, s=0.55, expr="worried", look=-0.6, lookY=-1)],
      props=[P("stamp", 960, 520, front=True, text="NO OFFICE", size=90, a="@huge office"), P("stamp", 960, 680, front=True, text="NO COMPANY", size=70, color="#2b2522", a="@powerful company")]),
    S("Just an idea, a garage", "stage", set="garage", cam=dict(z=[1.0, 1.12], f=[0.5, 0.55]),
      chars=[F("visionary", 820, expr="happy", look=0.4, armL="up"), F("engineer", 1100, expr="happy", look=-0.4, armR="up")],
      props=[P("label", 420, 520, text="AN IDEA", size=72, c="#ffd21f", at="@idea", rot=-6), P("label", 960, 260, text="A GARAGE", size=72, c="#fff", at="@garage"),
             P("label", 1500, 520, text="A DREAM", size=72, c="#ffd21f", at="@dream", rot=6)]),
    # ---- chapter 1 ----
    chapter("Steve Wozniak was the engineering", "Two Steves", "1"),
    S("He designed a personal computer", "stage", set="garage", cam=dict(z=[1.0, 1.12], f=[0.55, 0.55]),
      chars=[F("engineer", 520, expr="smile", armR="point", look=0.6)],
      props=[P("board", 1180, 520, s=0.95, at="+0.2"), P("label", 1180, 830, text="APPLE I", size=96, c="#fff", at="@Apple One")]),
    S("Steve Jobs saw something bigger", "stage", set="garage", cam=dict(z=[1.0, 1.08], f=[0.5, 0.5]),
      chars=[F("visionary", 700, y=470 + 290 * 2.3, s=2.3, expr="think", look=0.6, lookY=-1, k=[dict(t="@bigger", expr="happy")])],
      props=[P("thought", 1350, 330, s=1.0, at="+0.3"), P("house", 1350, 420, s=0.45, at="+0.5"), P("label", 1350, 700, text="BIGGER", size=90, c="#ffd21f", at="@bigger")]),
    S("He believed computers shouldn't just be", "split", panels=[
        dict(set="datacenter", chars=[C("eng", 900, s=0.9, expr="calm"), C("eng2", 1080, s=0.9, expr="neutral")],
             props=[P("label", 960, 200, text="SCIENTISTS", size=90, c="#fff", at="@scientists")]),
        dict(set="office", chars=[C("suitA", 860, s=0.9, expr="smug"), C("suitB", 1060, s=0.9, expr="calm")],
             props=[P("label", 960, 200, text="BUSINESSES", size=90, c="#fff", at="@businesses")])]),
    S("They should be something ordinary people", "stage", set="home", cam=dict(z=[1.0, 1.1], f=[0.5, 0.6]),
      chars=[C("woman", 620, expr="happy", armR="point", look=0.6), C("kid", 1300, s=0.75, expr="happy", armL="up", armR="up", look=-0.6)],
      props=[P("pc", 960, 880, s=0.85, at="+0.2"), P("label", 960, 200, text="AT HOME", size=90, c="#ffd21f", at="@own homes")]),
    card("But turning an invention", "Turning an invention into a business *wasn't* *easy.*", "@>wasn't easy"),
    S("They needed money", "stage", set="paper", cam=dict(z=[1.0, 1.08], f=[0.5, 0.5]),
      chars=[F("visionary", 820, y=960, s=0.8, expr="worried", look=0.3, lookY=-1), F("engineer", 1100, y=960, s=0.8, expr="worried", look=-0.3, lookY=-1)],
      props=[P("money", 420, 520, s=0.9, n=4, at="@money"), P("label", 420, 610, text="MONEY", size=64, c="#fff", at="@money"),
             P("crowd", 960, 330, s=0.7, n=5, w=700, expr="smile", at="@customers"), P("label", 960, 400, text="CUSTOMERS", size=64, c="#fff", at="@customers"),
             P("q", 1500, 430, at="@someone willing"), P("label", 1500, 610, text="A BELIEVER", size=64, c="#ffd21f", at="@believe")]),
    S("So they took a huge risk", "stage", set="garage", cam=dict(z=[1.0, 1.14], f=[0.5, 0.5], shake="@huge risk"),
      chars=[F("visionary", 800, expr="angry", armR="point", look=0.4), F("engineer", 1120, expr="shock", look=-0.4)],
      props=[P("label", 960, 240, text="ALL IN", size=110, c="#ffd21f", at="@risk")]),
    S("sold what they could", "stage", set="paper", cam=dict(z=[1.0, 1.06], f=[0.5, 0.5]),
      props=[P("van", 640, 760, s=1.0, label="VAN"), P("calc", 1350, 640, s=1.0),
             P("stamp", 640, 560, text="SOLD", size=90, a="+0.2", front=True), P("stamp", 1350, 560, text="SOLD", size=90, a="+0.6", front=True)]),
    S("and started building their company", "stage", set="garage", cam=dict(z=[1.0, 1.1], f=[0.5, 0.55]),
      chars=[F("visionary", 560, expr="happy", armL="box", armR="box", holdBox=P("box", 0, 0, s=0.8, label="PARTS")), F("engineer", 1380, expr="smile", armR="point", look=-0.5)],
      props=[P("sign", 960, 340, w=640, text="APPLE COMPUTER", a="+0.2", b="+1.4", size=60), P("board", 1000, 800, s=0.45)]),
    S("They even brought in a third co-founder", "stage", set="garage", cam=dict(z=[1.0, 1.08], f=[0.5, 0.58]),
      chars=[F("visionary", 560, expr="smile", look=0.7), F("engineer", 820, expr="smile", look=0.7, armR="wave"),
             F("partner3", 1700, expr="smile", look=-0.6, walk=dict(x0=1750, x1=1320, a="+0.1", b="+1.6"))],
      props=[P("tag", 1320, 420, s=1.5, text="RONALD WAYNE", at="@Ronald Wayne"), P("label", 960, 180, text="CO-FOUNDER #3", size=70, c="#ffd21f", at="@third")]),
    # ---- chapter 2 ----
    chapter("Then came the Apple II", "The Big Break", "2"),
    S("in 1977", "stage", set="paper", place="1977", cam=dict(z=[1.0, 1.1], f=[0.5, 0.55]),
      props=[P("pc", 960, 760, s=1.0), P("label", 960, 230, text="APPLE II", size=110, c="#fff"),
             P("crowd", 960, 1090, s=1.0, n=9, w=1800, expr="happy", front=True), P("stamp", 1480, 330, text="HIT!", size=110, color="#2f9a4a", a="@major success")]),
    S("and helped transform Apple", "stage", set="skyline", cam=dict(z=[1.0, 1.08], f=[0.5, 0.6]),
      props=[P("building", 960, 905, label="APPLE", a="+0.3", b="+2.6"), P("label", 520, 300, text="SMALL STARTUP", size=64, c="#fff", at="@small startup"),
             ]),
    S("into one of the most important", "stage", set="hq", label="APPLE", place="AMERICA", cam=dict(z=[1.0, 1.1], f=[0.5, 0.5]),
      chars=[C("suitA", 620, y=960, s=0.6, expr="happy", look=0.5, lookY=-1), C("woman", 1300, y=960, s=0.6, expr="shock", look=-0.5, lookY=-1)],
      props=[P("label", 960, 150, text="TECH GIANT", size=90, c="#ffd21f", at="@important technology")]),
    S("Their little idea", "stage", set="paper", cam=dict(z=[1.0, 1.08], f=[0.5, 0.5]),
      props=[P("chart", 960, 470, s=0.9, a="+0.2", b="+3.2", label="APPLE"), P("label", 1150, 860, text="BIGGER THAN ANYONE IMAGINED", size=56, c="#2f9a4a", stroke=False, at="@anyone imagined")],
      chars=[F("visionary", 330, y=960, s=0.6, expr="shock", look=0.6, lookY=-1), F("engineer", 520, y=960, s=0.6, expr="happy", look=0.6, lookY=-1)]),
    # ---- chapter 3 ----
    chapter("Years later", "Years Later", "3"),
    S("Apple would introduce products", "stage", set="keynote", cam=dict(z=[1.0, 1.1], f=[0.5, 0.55]),
      chars=[C("presenter", 760, expr="smile", armR="pointUp", look=0.4, talk=True)],
      screen=[P("device", 0, -10, s=0.9, type="phone"), P("label", 300, 150, text="NEW", size=70, c="#ffd21f", at="+0.6")],
      fg=[P("audience", 0, 0)]),
    S("listen to music", "split", panels=[
        dict(set="home", props=[P("device", 960, 520, s=1.0, type="player", at="+0.1"), P("label", 960, 860, text="MUSIC", size=80, c="#fff", at="@music")]),
        dict(set="office", props=[P("pc", 960, 820, s=0.9, mode="game", at="@work"), P("label", 960, 200, text="WORK", size=80, c="#fff", at="@work")]),
        dict(set="home", chars=[C("woman", 880, s=0.85, expr="happy", armR="phone", holdR=P("device", 0, 0, s=0.18, type="phone")), C("kid", 1080, s=0.65, expr="happy", armL="up")],
             props=[P("label", 960, 200, text="LIFE", size=80, c="#ffd21f", at="@live")])]),
    S("The iPod, the iPhone", "stage", set="paper", cam=dict(z=[1.0, 1.06], f=[0.5, 0.5]),
      props=[P("device", 450, 470, s=1.0, type="player", label="iPod", at="+0.05"), P("device", 960, 450, s=1.0, type="phone", label="iPhone", at="@iPhone"),
             P("device", 1480, 470, s=0.85, type="tablet", label="iPad", at="@iPad")]),
    S("and eventually, a company worth", "stage", set="trading", cam=dict(z=[1.0, 1.12], f=[0.5, 0.55]),
      props=[P("money", 560, 860, s=1.2, n=5), P("money", 1360, 860, s=1.2, n=6), P("money", 960, 880, s=1.4, n=7),
             P("crown", 960, 560, s=0.9, at="@worth"), P("label", 960, 440, text="TRILLIONS", size=140, c="#ffd21f", at="@trillions")]),
    S("And it all started with two young men", "stage", set="garage", place="1976", cam=dict(z=[1.0, 1.14], f=[0.5, 0.6]),
      chars=[F("visionary", 700, expr="smile", look=0.6), F("engineer", 1220, expr="happy", look=-0.6)],
      props=[P("board", 960, 760, s=0.5), P("globe", 960, 330, s=0.6, at="@change the world")]),
    S("because sometimes", "stage", set="paper", v="dark", cam=dict(z=[1.0, 1.15], f=[0.5, 0.5]),
      props=[P("bulb", 960, 520, s=0.5, at="+0.1", grow=dict(s=1.8, a="+0.2", b="+1.6"))]),
    card("the biggest companies on earth", "The *biggest* companies on earth begin with nothing more than a *small* *idea.*", "@>small idea"),
]
