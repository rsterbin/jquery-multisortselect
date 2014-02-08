// List of programming languages, from Wikipedia
var programming_langugages = [
    { id: 1, label: "A# .NET" }, { id: 2, label: "A# (Axiom)" },
    { id: 3, label: "A-0 System" }, { id: 4, label: "A+" },
    { id: 5, label: "A++" }, { id: 6, label: "ABAP" }, { id: 7, label: "ABC" },
    { id: 8, label: "ABC ALGOL" }, { id: 9, label: "ABLE" },
    { id: 10, label: "ABSET" }, { id: 11, label: "ABSYS" },
    { id: 12, label: "Abundance" }, { id: 13, label: "ACC" },
    { id: 14, label: "Accent" }, { id: 15, label: "Ace DASL" },
    { id: 16, label: "ACL2" }, { id: 17, label: "ACT-III" },
    { id: 18, label: "Action!" }, { id: 19, label: "ActionScript" },
    { id: 20, label: "Ada" }, { id: 21, label: "Adenine" },
    { id: 22, label: "Agda" }, { id: 23, label: "Agilent VEE" },
    { id: 24, label: "Agora" }, { id: 25, label: "AIMMS" },
    { id: 26, label: "Alef" }, { id: 27, label: "ALF" },
    { id: 28, label: "ALGOL 58" }, { id: 29, label: "ALGOL 60" },
    { id: 30, label: "ALGOL 68" }, { id: 31, label: "Alice" },
    { id: 32, label: "Alma-0" }, { id: 33, label: "AmbientTalk" },
    { id: 34, label: "Amiga E" }, { id: 35, label: "AMOS" },
    { id: 36, label: "AMPL" }, { id: 37, label: "APL" },
    { id: 38, label: "AppleScript" }, { id: 39, label: "Arc" },
    { id: 40, label: "ARexx" }, { id: 41, label: "Argus" },
    { id: 42, label: "AspectJ" }, { id: 43, label: "Assembly language" },
    { id: 44, label: "ATS" }, { id: 45, label: "Ateji PX" },
    { id: 46, label: "AutoHotkey" }, { id: 47, label: "Autocoder" },
    { id: 48, label: "AutoIt" }, { id: 49, label: "AutoLISP / Visual LISP" },
    { id: 50, label: "Averest" }, { id: 51, label: "AWK" },
    { id: 52, label: "Axum" }, { id: 53, label: "B" },
    { id: 54, label: "Babbage" }, { id: 55, label: "BAIL" },
    { id: 56, label: "Bash" }, { id: 57, label: "BASIC" },
    { id: 58, label: "bc" }, { id: 59, label: "BCPL" },
    { id: 60, label: "BeanShell" }, { id: 61, label: "Batch (Windows/Dos)" },
    { id: 62, label: "Bertrand" }, { id: 63, label: "BETA" },
    { id: 64, label: "Bigwig" }, { id: 65, label: "Bistro" },
    { id: 66, label: "BitC" }, { id: 67, label: "BLISS" },
    { id: 68, label: "Blue" }, { id: 69, label: "Bon" },
    { id: 70, label: "Boo" }, { id: 71, label: "Boomerang" },
    { id: 72, label: "Bourne shell (including bash and ksh)" },
    { id: 73, label: "BREW" }, { id: 74, label: "BPEL" },
    { id: 75, label: "BUGSYS" }, { id: 76, label: "BuildProfessional" },
    { id: 77, label: "C" }, { id: 78, label: "C--" },
    { id: 79, label: "C++ - ISO/IEC 14882" },
    { id: 80, label: "C# - ISO/IEC 23270" }, { id: 81, label: "C/AL" },
    { id: 82, label: "Caché ObjectScript" }, { id: 83, label: "C Shell" },
    { id: 84, label: "Caml" }, { id: 85, label: "Candle" },
    { id: 86, label: "Cayenne" }, { id: 87, label: "CDuce" },
    { id: 88, label: "Cecil" }, { id: 89, label: "Cel" },
    { id: 90, label: "Cesil" }, { id: 91, label: "Ceylon" },
    { id: 92, label: "CFML" }, { id: 93, label: "Cg" },
    { id: 94, label: "Ch" }, { id: 95, label: "Chapel" },
    { id: 96, label: "CHAIN" }, { id: 97, label: "Charity" },
    { id: 98, label: "Charm" }, { id: 99, label: "Chef" },
    { id: 100, label: "CHILL" }, { id: 101, label: "CHIP-8" },
    { id: 102, label: "chomski" }, { id: 103, label: "ChucK" },
    { id: 104, label: "CICS" }, { id: 105, label: "Cilk" },
    { id: 106, label: "CL (IBM)" }, { id: 107, label: "Claire" },
    { id: 108, label: "Clarion" }, { id: 109, label: "Clean" },
    { id: 110, label: "Clipper" }, { id: 111, label: "CLIST" },
    { id: 112, label: "Clojure" }, { id: 113, label: "CLU" },
    { id: 114, label: "CMS-2" }, { id: 115, label: "COBOL - ISO/IEC 1989" },
    { id: 116, label: "CobolScript" }, { id: 117, label: "Cobra" },
    { id: 118, label: "CODE" }, { id: 119, label: "CoffeeScript" },
    { id: 120, label: "Cola" }, { id: 121, label: "ColdC" },
    { id: 122, label: "ColdFusion" }, { id: 123, label: "Cool" },
    { id: 124, label: "COMAL" },
    { id: 125, label: "Combined Programming Language (CPL)" },
    { id: 126, label: "Common Intermediate Language (CIL)" },
    { id: 127, label: "Common Lisp (also known as CL)" },
    { id: 128, label: "COMPASS" }, { id: 129, label: "Component Pascal" },
    { id: 130, label: "COMIT" },
    { id: 131, label: "Constraint Handling Rules (CHR)" },
    { id: 132, label: "Converge" }, { id: 133, label: "Coral 66" },
    { id: 134, label: "Corn" }, { id: 135, label: "CorVision" },
    { id: 136, label: "Coq" }, { id: 137, label: "COWSEL" },
    { id: 138, label: "CPL" }, { id: 139, label: "csh" },
    { id: 140, label: "CSP" }, { id: 141, label: "Csound" },
    { id: 142, label: "Curl" }, { id: 143, label: "Curry" },
    { id: 144, label: "Cyclone" }, { id: 145, label: "Cython" },
    { id: 146, label: "D" },
    { id: 147, label: "DASL (Datapoint's Advanced Systems Language)" },
    { id: 148, label: "DASL (Distributed Application Specification Language)" },
    { id: 149, label: "Dart" }, { id: 150, label: "DataFlex" },
    { id: 151, label: "Datalog" }, { id: 152, label: "DATATRIEVE" },
    { id: 153, label: "dBase" }, { id: 154, label: "dc" },
    { id: 155, label: "DCL" }, { id: 156, label: "Deesel (formerly G)" },
    { id: 157, label: "Delphi" }, { id: 158, label: "DinkC" },
    { id: 159, label: "DIBOL" }, { id: 160, label: "Dog" },
    { id: 161, label: "Draco" }, { id: 162, label: "Dylan" },
    { id: 163, label: "DYNAMO" }, { id: 164, label: "E" },
    { id: 165, label: "E#" }, { id: 166, label: "Ease" },
    { id: 167, label: "Easy PL/I" }, { id: 168, label: "EASYTRIEVE PLUS" },
    { id: 169, label: "ECMAScript" }, { id: 170, label: "Edinburgh IMP" },
    { id: 171, label: "EGL" }, { id: 172, label: "Eiffel" },
    { id: 173, label: "ELAN" }, { id: 174, label: "Elixir" },
    { id: 175, label: "Elm" }, { id: 176, label: "Emacs Lisp" },
    { id: 177, label: "Emerald" }, { id: 178, label: "Epigram" },
    { id: 179, label: "Erlang" }, { id: 180, label: "es" },
    { id: 181, label: "Escapade" }, { id: 182, label: "Escher" },
    { id: 183, label: "ESPOL" }, { id: 184, label: "Esterel" },
    { id: 185, label: "Etoys" }, { id: 186, label: "Euclid" },
    { id: 187, label: "Euler" }, { id: 188, label: "Euphoria" },
    { id: 189, label: "EusLisp Robot Programming Language" },
    { id: 190, label: "CMS EXEC" }, { id: 191, label: "EXEC 2" },
    { id: 192, label: "F" }, { id: 193, label: "F#" },
    { id: 194, label: "Factor" }, { id: 195, label: "Falcon" },
    { id: 196, label: "Fancy" }, { id: 197, label: "Fantom" },
    { id: 198, label: "FAUST" }, { id: 199, label: "Felix" },
    { id: 200, label: "Ferite" }, { id: 201, label: "FFP" },
    { id: 202, label: "Fjölnir" }, { id: 203, label: "FL" },
    { id: 204, label: "Flavors" }, { id: 205, label: "Flex" },
    { id: 206, label: "FLOW-MATIC" }, { id: 207, label: "FOCAL" },
    { id: 208, label: "FOCUS" }, { id: 209, label: "FOIL" },
    { id: 210, label: "FORMAC" }, { id: 211, label: "@Formula" },
    { id: 212, label: "Forth" }, { id: 213, label: "Fortran - ISO/IEC 1539" },
    { id: 214, label: "Fortress" }, { id: 215, label: "FoxBase" },
    { id: 216, label: "FoxPro" }, { id: 217, label: "FP" },
    { id: 218, label: "FPr" }, { id: 219, label: "Franz Lisp" },
    { id: 220, label: "Frink" }, { id: 221, label: "F-Script" },
    { id: 222, label: "FSProg" }, { id: 223, label: "G" },
    { id: 224, label: "Game Maker Language" },
    { id: 225, label: "GameMonkey Script" }, { id: 226, label: "GAMS" },
    { id: 227, label: "GAP" }, { id: 228, label: "G-code" },
    { id: 229, label: "Genie" }, { id: 230, label: "GDL" },
    { id: 231, label: "Gibiane" }, { id: 232, label: "GJ" },
    { id: 233, label: "GEORGE" }, { id: 234, label: "GLSL" },
    { id: 235, label: "GNU E" }, { id: 236, label: "GM" },
    { id: 237, label: "Go" }, { id: 238, label: "Go!" },
    { id: 239, label: "GOAL" }, { id: 240, label: "Gödel" },
    { id: 241, label: "Godiva" }, { id: 242, label: "GOM (Good Old Mad)" },
    { id: 243, label: "Goo" }, { id: 244, label: "Gosu" },
    { id: 245, label: "GOTRAN" }, { id: 246, label: "GPSS" },
    { id: 247, label: "GraphTalk" }, { id: 248, label: "GRASS" },
    { id: 249, label: "Groovy" }, { id: 250, label: "HAL/S" },
    { id: 251, label: "Hamilton C shell" }, { id: 252, label: "Harbour" },
    { id: 253, label: "Hartmann pipelines" }, { id: 254, label: "Haskell" },
    { id: 255, label: "Haxe" }, { id: 256, label: "High Level Assembly" },
    { id: 257, label: "HLSL" }, { id: 258, label: "Hop" },
    { id: 259, label: "Hope" }, { id: 260, label: "Hugo" },
    { id: 261, label: "Hume" }, { id: 262, label: "HyperTalk" },
    { id: 263, label: "IBM Basic assembly language" },
    { id: 264, label: "IBM HAScript" }, { id: 265, label: "IBM Informix-4GL" },
    { id: 266, label: "IBM RPG" }, { id: 267, label: "ICI" },
    { id: 268, label: "Icon" }, { id: 269, label: "Id" },
    { id: 270, label: "IDL" }, { id: 271, label: "Idris" },
    { id: 272, label: "IMP" }, { id: 273, label: "Inform" },
    { id: 274, label: "Io" }, { id: 275, label: "Ioke" },
    { id: 276, label: "IPL" }, { id: 277, label: "IPTSCRAE" },
    { id: 278, label: "ISLISP" }, { id: 279, label: "ISPF" },
    { id: 280, label: "ISWIM" }, { id: 281, label: "J" },
    { id: 282, label: "J#" }, { id: 283, label: "J++" },
    { id: 284, label: "JADE" }, { id: 285, label: "Jako" },
    { id: 286, label: "JAL" }, { id: 287, label: "Janus" },
    { id: 288, label: "JASS" }, { id: 289, label: "Java" },
    { id: 290, label: "JavaScript" }, { id: 291, label: "JCL" },
    { id: 292, label: "JEAN" }, { id: 293, label: "Join Java" },
    { id: 294, label: "JOSS" }, { id: 295, label: "Joule" },
    { id: 296, label: "JOVIAL" }, { id: 297, label: "Joy" },
    { id: 298, label: "JScript" }, { id: 299, label: "JavaFX Script" },
    { id: 300, label: "Julia" }, { id: 301, label: "K" },
    { id: 302, label: "Kaleidoscope" }, { id: 303, label: "Karel" },
    { id: 304, label: "Karel++" }, { id: 305, label: "Kaya" },
    { id: 306, label: "KEE" }, { id: 307, label: "KIF" },
    { id: 308, label: "Kojo" }, { id: 309, label: "KRC" },
    { id: 310, label: "KRL" }, { id: 311, label: "KRL (KUKA Robot Language)" },
    { id: 312, label: "KRYPTON" }, { id: 313, label: "ksh" },
    { id: 314, label: "L" }, { id: 315, label: "L# .NET" },
    { id: 316, label: "LabVIEW" }, { id: 317, label: "Ladder" },
    { id: 318, label: "Lagoona" }, { id: 319, label: "LANSA" },
    { id: 320, label: "Lasso" }, { id: 321, label: "LaTeX" },
    { id: 322, label: "Lava" }, { id: 323, label: "LC-3" },
    { id: 324, label: "Leadwerks Script" }, { id: 325, label: "Leda" },
    { id: 326, label: "Legoscript" }, { id: 327, label: "LIL" },
    { id: 328, label: "LilyPond" }, { id: 329, label: "Limbo" },
    { id: 330, label: "Limnor" }, { id: 331, label: "LINC" },
    { id: 332, label: "Lingo" }, { id: 333, label: "Linoleum" },
    { id: 334, label: "LIS" }, { id: 335, label: "LISA" },
    { id: 336, label: "Lisaac" }, { id: 337, label: "Lisp - ISO/IEC 13816" },
    { id: 338, label: "Lite-C" }, { id: 339, label: "Lithe" },
    { id: 340, label: "Little b" }, { id: 341, label: "Logo" },
    { id: 342, label: "Logtalk" }, { id: 343, label: "LPC" },
    { id: 344, label: "LSE" }, { id: 345, label: "LSL" },
    { id: 346, label: "LiveCode" }, { id: 347, label: "Lua" },
    { id: 348, label: "Lucid" }, { id: 349, label: "Lustre" },
    { id: 350, label: "LYaPAS" }, { id: 351, label: "Lynx" },
    { id: 352, label: "M" }, { id: 353, label: "M2001" },
    { id: 354, label: "M4" }, { id: 355, label: "Machine code" },
    { id: 356, label: "MAD (Michigan Algorithm Decoder)" },
    { id: 357, label: "MAD/I" }, { id: 358, label: "Magik" },
    { id: 359, label: "Magma" }, { id: 360, label: "make" },
    { id: 361, label: "Maple" },
    { id: 362, label: "MAPPER (Unisys/Sperry) now part of BIS" },
    { id: 363, label: "MARK-IV (Sterling/Informatics) now VISION:BUILDER of CA" },
    { id: 364, label: "Mary" },
    { id: 365, label: "MASM Microsoft Assembly x86" },
    { id: 366, label: "Mathematica" }, { id: 367, label: "MATLAB" },
    { id: 368, label: "Maxima (see also Macsyma)" },
    { id: 369, label: "Max (Max Msp - Graphical Programming Environment)" },
    { id: 370, label: "MaxScript internal language 3D Studio Max" },
    { id: 371, label: "Maya (MEL)" }, { id: 372, label: "MDL" },
    { id: 373, label: "Mercury" }, { id: 374, label: "Mesa" },
    { id: 375, label: "Metacard" }, { id: 376, label: "Metafont" },
    { id: 377, label: "MetaL" }, { id: 378, label: "Microcode" },
    { id: 379, label: "MicroScript" }, { id: 380, label: "MIIS" },
    { id: 381, label: "MillScript" }, { id: 382, label: "MIMIC" },
    { id: 383, label: "Mirah" }, { id: 384, label: "Miranda" },
    { id: 385, label: "MIVA Script" }, { id: 386, label: "ML" },
    { id: 387, label: "Moby" }, { id: 388, label: "Model 204" },
    { id: 389, label: "Modelica" }, { id: 390, label: "Modula" },
    { id: 391, label: "Modula-2" }, { id: 392, label: "Modula-3" },
    { id: 393, label: "Mohol" }, { id: 394, label: "MOO" },
    { id: 395, label: "Mortran" }, { id: 396, label: "Mouse" },
    { id: 397, label: "MPD" },
    { id: 398, label: "MSIL - deprecated name for CIL" },
    { id: 399, label: "MSL" }, { id: 400, label: "MUMPS" },
    { id: 401, label: "NASM" }, { id: 402, label: "NATURAL" },
    { id: 403, label: "Napier88" }, { id: 404, label: "Neko" },
    { id: 405, label: "Nemerle" }, { id: 406, label: "NESL" },
    { id: 407, label: "Net.Data" }, { id: 408, label: "NetLogo" },
    { id: 409, label: "NetRexx" }, { id: 410, label: "NewLISP" },
    { id: 411, label: "NEWP" }, { id: 412, label: "Newspeak" },
    { id: 413, label: "NewtonScript" }, { id: 414, label: "NGL" },
    { id: 415, label: "Nial" }, { id: 416, label: "Nice" },
    { id: 417, label: "Nickle" }, { id: 418, label: "NPL" },
    { id: 419, label: "Not eXactly C (NXC)" },
    { id: 420, label: "Not Quite C (NQC)" }, { id: 421, label: "NSIS" },
    { id: 422, label: "Nu" }, { id: 423, label: "NWScript" },
    { id: 424, label: "o:XML" }, { id: 425, label: "Oak" },
    { id: 426, label: "Oberon" }, { id: 427, label: "Obix" },
    { id: 428, label: "OBJ2" }, { id: 429, label: "Object Lisp" },
    { id: 430, label: "ObjectLOGO" }, { id: 431, label: "Object REXX" },
    { id: 432, label: "Object Pascal" }, { id: 433, label: "Objective-C" },
    { id: 434, label: "Objective-J" }, { id: 435, label: "Obliq" },
    { id: 436, label: "Obol" }, { id: 437, label: "OCaml" },
    { id: 438, label: "occam" }, { id: 439, label: "occam-π" },
    { id: 440, label: "Octave" }, { id: 441, label: "OmniMark" },
    { id: 442, label: "Onyx" }, { id: 443, label: "Opa" },
    { id: 444, label: "Opal" }, { id: 445, label: "OpenEdge ABL" },
    { id: 446, label: "OPL" }, { id: 447, label: "OPS5" },
    { id: 448, label: "OptimJ" }, { id: 449, label: "Orc" },
    { id: 450, label: "ORCA/Modula-2" }, { id: 451, label: "Oriel" },
    { id: 452, label: "Orwell" }, { id: 453, label: "Oxygene" },
    { id: 454, label: "Oz" }, { id: 455, label: "P#" },
    { id: 456, label: "PARI/GP" }, { id: 457, label: "Pascal - ISO 7185" },
    { id: 458, label: "Pawn" }, { id: 459, label: "PCASTL" },
    { id: 460, label: "PCF" }, { id: 461, label: "PEARL" },
    { id: 462, label: "PeopleCode" }, { id: 463, label: "Perl" },
    { id: 464, label: "PDL" }, { id: 465, label: "PHP" },
    { id: 466, label: "Phrogram" }, { id: 467, label: "Pico" },
    { id: 468, label: "Pict" }, { id: 469, label: "Pike" },
    { id: 470, label: "PIKT" }, { id: 471, label: "PILOT" },
    { id: 472, label: "Pipelines" }, { id: 473, label: "Pizza" },
    { id: 474, label: "PL-11" }, { id: 475, label: "PL/0" },
    { id: 476, label: "PL/B" }, { id: 477, label: "PL/C" },
    { id: 478, label: "PL/I - ISO 6160" }, { id: 479, label: "PL/M" },
    { id: 480, label: "PL/P" }, { id: 481, label: "PL/SQL" },
    { id: 482, label: "PL360" }, { id: 483, label: "PLANC" },
    { id: 484, label: "Plankalkül" }, { id: 485, label: "PLEX" },
    { id: 486, label: "PLEXIL" }, { id: 487, label: "Plus" },
    { id: 488, label: "POP-11" }, { id: 489, label: "PostScript" },
    { id: 490, label: "PortablE" }, { id: 491, label: "Powerhouse" },
    { id: 492, label: "PowerBuilder - 4GL GUI appl. generator from Sybase" },
    { id: 493, label: "PowerShell" }, { id: 494, label: "PPL" },
    { id: 495, label: "Processing" }, { id: 496, label: "Processing.js" },
    { id: 497, label: "Prograph" }, { id: 498, label: "PROIV" },
    { id: 499, label: "Prolog" }, { id: 500, label: "Visual Prolog" },
    { id: 501, label: "Promela" }, { id: 502, label: "PROTEL" },
    { id: 503, label: "ProvideX" }, { id: 504, label: "Pro*C" },
    { id: 505, label: "Pure" }, { id: 506, label: "Python" },
    { id: 507, label: "Q (equational programming language)" },
    { id: 508, label: "Q (programming language from Kx Systems)" },
    { id: 509, label: "Qalb" }, { id: 510, label: "* Qi" },
    { id: 511, label: "Qore" }, { id: 512, label: "QtScript" },
    { id: 513, label: "QuakeC" }, { id: 514, label: "QPL" },
    { id: 515, label: "R" }, { id: 516, label: "R++" },
    { id: 517, label: "Racket" }, { id: 518, label: "RAPID" },
    { id: 519, label: "Rapira" }, { id: 520, label: "Ratfiv" },
    { id: 521, label: "Ratfor" }, { id: 522, label: "rc" },
    { id: 523, label: "REBOL" }, { id: 524, label: "Red" },
    { id: 525, label: "Redcode" }, { id: 526, label: "REFAL" },
    { id: 527, label: "Reia" }, { id: 528, label: "Revolution" },
    { id: 529, label: "rex" }, { id: 530, label: "REXX" },
    { id: 531, label: "Rlab" }, { id: 532, label: "ROOP" },
    { id: 533, label: "RPG" }, { id: 534, label: "RPL" },
    { id: 535, label: "RSL" }, { id: 536, label: "RTL/2" },
    { id: 537, label: "Ruby" }, { id: 538, label: "Rust" },
    { id: 539, label: "S" }, { id: 540, label: "S2" },
    { id: 541, label: "S3" }, { id: 542, label: "S-Lang" },
    { id: 543, label: "S-PLUS" }, { id: 544, label: "SA-C" },
    { id: 545, label: "SabreTalk" }, { id: 546, label: "SAIL" },
    { id: 547, label: "SALSA" }, { id: 548, label: "SAM76" },
    { id: 549, label: "SAS" }, { id: 550, label: "SASL" },
    { id: 551, label: "Sather" }, { id: 552, label: "Sawzall" },
    { id: 553, label: "SBL" }, { id: 554, label: "Scala" },
    { id: 555, label: "Scheme" }, { id: 556, label: "Scilab" },
    { id: 557, label: "Scratch" }, { id: 558, label: "Script.NET" },
    { id: 559, label: "Sed" }, { id: 560, label: "Seed7" },
    { id: 561, label: "Self" }, { id: 562, label: "SenseTalk" },
    { id: 563, label: "SequenceL" }, { id: 564, label: "SETL" },
    { id: 565, label: "Shift Script" }, { id: 566, label: "SIMPOL" },
    { id: 567, label: "SIMSCRIPT" }, { id: 568, label: "Simula" },
    { id: 569, label: "Simulink" }, { id: 570, label: "SISAL" },
    { id: 571, label: "SLIP" }, { id: 572, label: "SMALL" },
    { id: 573, label: "Smalltalk" }, { id: 574, label: "Small Basic" },
    { id: 575, label: "SML" }, { id: 576, label: "SNOBOL(SPITBOL)" },
    { id: 577, label: "Snowball" }, { id: 578, label: "SOL" },
    { id: 579, label: "Span" }, { id: 580, label: "SPARK" },
    { id: 581, label: "SPIN" }, { id: 582, label: "SP/k" },
    { id: 583, label: "SPS" }, { id: 584, label: "Squeak" },
    { id: 585, label: "Squirrel" }, { id: 586, label: "SR" },
    { id: 587, label: "S/SL" }, { id: 588, label: "Starlogo" },
    { id: 589, label: "Strand" }, { id: 590, label: "Stata" },
    { id: 591, label: "Stateflow" }, { id: 592, label: "Subtext" },
    { id: 593, label: "SuperCollider" }, { id: 594, label: "SuperTalk" },
    { id: 595, label: "SYMPL" }, { id: 596, label: "SyncCharts" },
    { id: 597, label: "SystemVerilog" }, { id: 598, label: "T" },
    { id: 599, label: "TACL" }, { id: 600, label: "TACPOL" },
    { id: 601, label: "TADS" }, { id: 602, label: "TAL" },
    { id: 603, label: "Tcl" }, { id: 604, label: "Tea" },
    { id: 605, label: "TECO" }, { id: 606, label: "TELCOMP" },
    { id: 607, label: "TeX" }, { id: 608, label: "TEX" },
    { id: 609, label: "TIE" }, { id: 610, label: "Timber" },
    { id: 611, label: "TMG, compiler-compiler" }, { id: 612, label: "Tom" },
    { id: 613, label: "TOM" }, { id: 614, label: "Topspeed" },
    { id: 615, label: "TPU" }, { id: 616, label: "Trac" },
    { id: 617, label: "TTM" }, { id: 618, label: "T-SQL" },
    { id: 619, label: "TTCN" }, { id: 620, label: "Turing" },
    { id: 621, label: "TUTOR" }, { id: 622, label: "TXL" },
    { id: 623, label: "TypeScript" }, { id: 624, label: "Ubercode" },
    { id: 625, label: "UCSD Pascal" }, { id: 626, label: "Umple" },
    { id: 627, label: "Unicon" }, { id: 628, label: "Uniface" },
    { id: 629, label: "UNITY" }, { id: 630, label: "Unix shell" },
    { id: 631, label: "UnrealScript" }, { id: 632, label: "Vala" },
    { id: 633, label: "VBA" }, { id: 634, label: "VBScript" },
    { id: 635, label: "Verilog" }, { id: 636, label: "VHDL" },
    { id: 637, label: "Visual Basic" },
    { id: 638, label: "Visual Basic .NET" },
    { id: 639, label: "Microsoft Visual C++" },
    { id: 640, label: "Visual C#" }, { id: 641, label: "Visual DataFlex" },
    { id: 642, label: "Visual DialogScript" },
    { id: 643, label: "Visual Fortran" }, { id: 644, label: "Visual FoxPro" },
    { id: 645, label: "Visual J++" }, { id: 646, label: "Visual J#" },
    { id: 647, label: "Visual Objects" }, { id: 648, label: "VSXu" },
    { id: 649, label: "Vvvv" }, { id: 650, label: "WATFIV, WATFOR" },
    { id: 651, label: "WebDNA" }, { id: 652, label: "WebQL" },
    { id: 653, label: "Windows PowerShell" }, { id: 654, label: "Winbatch" },
    { id: 655, label: "X++" }, { id: 656, label: "X#" },
    { id: 657, label: "X10" }, { id: 658, label: "XBL" },
    { id: 659, label: "XC (exploits XMOS architecture)" },
    { id: 660, label: "xHarbour" }, { id: 661, label: "XL" },
    { id: 662, label: "XOTcl" }, { id: 663, label: "XPL" },
    { id: 664, label: "XPL0" }, { id: 665, label: "XQuery" },
    { id: 666, label: "XSB" }, { id: 667, label: "XSLT - See XPath" },
    { id: 668, label: "Ya" }, { id: 669, label: "Yorick" },
    { id: 670, label: "YQL" }, { id: 671, label: "Z notation" },
    { id: 672, label: "Zeno" }, { id: 673, label: "ZOPL" },
    { id: 674, label: "ZPL" }
];

// List of the 31 original Baskin Robins flavors, from Buzzfeed
var br_31_flavors = [
    { id: 1, label: "Eggnog" },
    { id: 2, label: "Peach" },
    { id: 3, label: "Coffee" },
    { id: 4, label: "Coffee Candy" },
    { id: 5, label: "Black Walnut" },
    { id: 6, label: "Banana Nut Fudge" },
    { id: 7, label: "Burgundy Cherry" },
    { id: 8, label: "Maple Nut" },
    { id: 9, label: "Lemon Crisp" },
    { id: 10, label: "Lemon Custard" },
    { id: 11, label: "Lemon Sherbet" },
    { id: 12, label: "Chocolate" },
    { id: 13, label: "Vanilla" },
    { id: 14, label: "Strawberry" },
    { id: 15, label: "Green Mint Stick" },
    { id: 16, label: "Chocolate Almond" },
    { id: 17, label: "Orange Sherbet" },
    { id: 18, label: "Butterscotch Ribbon" },
    { id: 19, label: "Cherry Macaroon" },
    { id: 20, label: "Chocolate Chip" },
    { id: 21, label: "Date Nut" },
    { id: 22, label: "Chocolate Fudge" },
    { id: 23, label: "Raspberry Sherbet" },
    { id: 24, label: "Chocolate Ribbon" },
    { id: 25, label: "Peppermint Stick" },
    { id: 26, label: "French Vanilla" },
    { id: 27, label: "Rocky Road" },
    { id: 28, label: "Pineapple Sherbet" },
    { id: 29, label: "Peppermint Fudge Ribbon" },
    { id: 30, label: "Chocolate Mint" },
    { id: 31, label: "Vanilla Burnt Almond" }
];

// Cardinal directions
var directions = [
    { id: 1, label: 'North' },
    { id: 2, label: 'Northeast' },
    { id: 3, label: 'East' },
    { id: 4, label: 'Southeast' },
    { id: 5, label: 'South' },
    { id: 6, label: 'Southwest' },
    { id: 7, label: 'West' },
    { id: 8, label: 'Northwest' }
];

