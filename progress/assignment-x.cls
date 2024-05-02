\NeedsTeXFormat{LaTeX2e}
\ProvidesClass{assignment-x}[Assignment]

\RequirePackage[utf8]{inputenc}
\RequirePackage[T1]{fontenc}
\RequirePackage{float}
\RequirePackage{fancyhdr}
\RequirePackage{extramarks}
\RequirePackage{amsmath}
\RequirePackage{amsthm}
\RequirePackage{amsfonts}
\RequirePackage{tikz}
\RequirePackage[plain]{algorithm}
\RequirePackage{algpseudocode}
\RequirePackage{xparse}
\RequirePackage{minted}
\RequirePackage{parskip}
\RequirePackage{siunitx}
\RequirePackage{multirow}
\RequirePackage{multicol}
\RequirePackage{booktabs}
\RequirePackage{url}


\sisetup{per-mode=symbol}
\sisetup{range-units=single}

\usetikzlibrary {graphs, quotes, shapes.geometric, shapes.misc}

\LoadClass{article}

\usetikzlibrary{automata,positioning,chains,decorations.pathreplacing,decorations.text}

%
% Basic Document Settings
%

\topmargin=-0.45in
\evensidemargin=0in
\oddsidemargin=0in
\textwidth=6.5in
\textheight=9.0in
\headsep=0.25in

\linespread{1.1}

\pagestyle{fancy}
\lhead{\@hmwkAuthorName}
\chead{\@hmwkClass\ (\@hmwkClassInstructor\ \@hmwkClassTime): \@hmwkTitle}
\rhead{\firstxmark}
\lfoot{\lastxmark}
\cfoot{\thepage}

\renewcommand\headrulewidth{0.4pt}
\renewcommand\footrulewidth{0.4pt}

\setlength\parindent{0pt}

%
% Create Problem Sections
%

\newcommand{\enterProblemHeader}[1]{
    \nobreak\extramarks{}{Problem \arabic{#1} continued on next page\ldots}\nobreak{}
    \nobreak\extramarks{Problem \arabic{#1} (continued)}{Problem \arabic{#1} continued on next page\ldots}\nobreak{}
}

\newcommand{\exitProblemHeader}[1]{
    \nobreak\extramarks{Problem \arabic{#1} (continued)}{Problem \arabic{#1} continued on next page\ldots}\nobreak{}
    \stepcounter{#1}
    \nobreak\extramarks{Problem \arabic{#1}}{}\nobreak{}
}

\setcounter{secnumdepth}{0}
\newcounter{partCounter}
\newcounter{homeworkProblemCounter}
\setcounter{homeworkProblemCounter}{1}
\nobreak\extramarks{Problem \arabic{homeworkProblemCounter}}{}\nobreak{}

%
% Homework Problem Environment
%
% This environment takes an optional argument. When given, it will adjust the
% problem counter. This is useful for when the problems given for your
% assignment aren't sequential. See the last 3 problems of this template for an
% example.
%
\newenvironment{homeworkProblem}[1][-1]{
    \ifnum#1>0
        \setcounter{homeworkProblemCounter}{#1}
    \fi
    \section{Problem \arabic{homeworkProblemCounter}}
    \setcounter{partCounter}{1}
    \enterProblemHeader{homeworkProblemCounter}
}{
    \exitProblemHeader{homeworkProblemCounter}
}

\newcommand{\@hmwkTitle}{\textbackslash hmwkTitle}
\newcommand{\@hmwkDueDate}{\textbackslash hmwkDueDate}
\newcommand{\@hmwkClass}{\textbackslash hmwkClass}
\newcommand{\@hmwkClassTime}{\textbackslash hmwkClassTime}
\newcommand{\@hmwkClassInstructor}{\textbackslash hmwkClassInstructor}
\newcommand{\@hmwkAuthorName}{\textbackslash hmwkAuthorName}

\newcommand{\hmwkTitle}[1]{\renewcommand{\@hmwkTitle}{{#1}}}
\newcommand{\hmwkDueDate}[1]{\renewcommand{\@hmwkDueDate}{{#1}}}
\newcommand{\hmwkClass}[1]{\renewcommand{\@hmwkClass}{{#1}}}
\newcommand{\hmwkClassTime}[1]{\renewcommand{\@hmwkClassTime}{{#1}}}
\newcommand{\hmwkClassInstructor}[1]{\renewcommand{\@hmwkClassInstructor}{{#1}}}
\newcommand{\hmwkAuthorName}[1]{\renewcommand{\@hmwkAuthorName}{{#1}}}

%
% Title Page
%

\title{
    \vspace{2in}
    \textmd{\textbf{\@hmwkClass:\ \@hmwkTitle}}\\
    \normalsize\vspace{0.1in}\small{Due\ on\ \@hmwkDueDate}\\
    \vspace{0.1in}\large{\textit{\@hmwkClassInstructor\ \@hmwkClassTime}}
    \vspace{3in}
}

\author{\textbf{\@hmwkAuthorName}}
\date{}

\renewcommand{\part}[1]{\textbf{\large Part \Alph{partCounter}}\stepcounter{partCounter}\\}

%
% Various Helper Commands
%

% Useful for algorithms
\newcommand{\alg}[1]{\textsc{\bfseries \footnotesize #1}}

% For derivatives
\newcommand{\deriv}[1]{\frac{\mathrm{d}}{\mathrm{d}x} (#1)}

% For partial derivatives
\newcommand{\pderiv}[2]{\frac{\partial}{\partial #1} (#2)}

% Integral dx
\newcommand{\dx}{\mathrm{d}x}

% Alias for the Solution section header
\newcommand{\solution}{\textbf{\large Solution}}

% Probability commands: Expectation, Variance, Covariance, Bias
\newcommand{\E}{\mathrm{E}}
\newcommand{\Var}{\mathrm{Var}}
\newcommand{\Cov}{\mathrm{Cov}}
\newcommand{\Bias}{\mathrm{Bias}}

% Bit environment
\newenvironment{bits}[1]{
    \begin{tikzpicture}[
        node distance=0pt,
         start chain = A going right,
            X/.style = {rectangle, draw,% styles of nodes in string (chain)
                        minimum width=2ex, minimum height=3ex,
                        outer sep=0pt, on chain},
            Y/.style = {rectangle, draw,% styles of nodes in string (chain)
                        minimum width=2ex, minimum height=3ex,
                        outer sep=0pt, on chain, fill=black!10},
            B/.style = {decorate,
                        decoration={brace, amplitude=5pt,
                        pre=moveto,pre length=1pt,post=moveto,post length=1pt,
                        raise=1mm, mirror}, % for mirroring of brace, if necessary
                        thick},
                                ]
        \foreach \i in {#1}%
            \ifnum \i = 1
                \node[Y] {\i}
            \else
                \node[X] {\i}
            \fi;
}{
        \end{tikzpicture}
}

\NewDocumentCommand{\img}{m m o}{
    \begin{figure}[H]
        \centering
        \IfNoValueTF{#3}
            {
                \IfFileExists{images/#1.jpg}{
                    \includegraphics[width=\textwidth]{images/#1.jpg}
                }{
                    \includegraphics[width=\textwidth]{images/#1.png}
                }
            }{
                \IfFileExists{images/#1.jpg}{
                    \includegraphics[width=#3]{images/#1.jpg}
                }{
                    \includegraphics[width=#3]{images/#1.png}
                }
            }
        \caption{#2}
        \label{fig:#1}
    \end{figure}
}

% Used for latex proofs, WIP, has hardcoded #2 parbox width
\usepackage{varwidth}
\newcommand{\proofline}[2]{& #1 && \textbf{\parbox[t]{7cm}{#2}} \\}
