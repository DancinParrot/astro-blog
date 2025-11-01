---
title: "Competitive Programming 101: The Very Basics"
pubDate: 2025-10-29
description: "A simple guide containing tips and tricks for beginners in competitive programming."
author: "Kai"
image:
  url: "https://docs.astro.build/assets/rose.webp"
  alt: "Sample image"
tags: ["cpp", "competitive programming"]
---

Recently, I have embarked on a grueling journey to improve my algorithmic and problem solving skills through competitive programming. I bought a full copy of Competitive Programming 4 and started griding problems listed in the book. Since I'm stuck in a military camp, I have to adopt the most archaic way of writing code, by literally, writing code down on a piece of paper.

It was a truly humbling experience as I could not even devise the most basic syntax without referring to online resources. I have never missed clangd so much ever since then. Now, I'm writing this article to share the basics of competitive programming that I've learnt so far before eventually diving into more advanced problems that deal with data structures and algorithms. 

## Understanding Problems

Unlike Leetcode, problems in competitive programming are usually **very** long-winded and verbose which may or may not contain useful information. As such, after reading through a problem description, you should aim to have an abridged understanding of it. Let's take a Kattis problem as an example, [Solving for Carrots](https://open.kattis.com/problems/carrots?tab=submissions).

### Abridged Description

Almost the entirety of the first paragraph of the problem describes, well, carrots 🥕, not very useful right (in terms of problem solving)? However, the last sentence is important, take note of the phrase, "earn a carrot for each difficult [huffle-puff] problem your solve".

The second paragraph is basically similar to the **Input** problem description, but it does still contain a crucial information, specifically, "find the number of carrots that will be handed out during the contest", which is our expected output.

Hence, the problem can be summarized to:

> Given n = the number of contestants, p = number of huffle-puff problems solved. Then, follow N non-empty lines of string. Print p.

As you can see, the solution is to just simply, print out the value of p. For harder problems, there would certainly be more to it, and even more things to take note of like Time/Space complexities.

## Input/Output

Competitive programming requires manual handling of I/O, that is, writing the appropriate function to parse varying forms of input from `stdin` and printing the output in the right format to `stdout`. As a result, those with a Leetcode background would find this unnerving as input is no longer provided as parameters of a predefined function.

Leetcode:

```cpp
vector<int> twoSum(vector<int>& nums, int target) {
  // ...
}
```

Competitive Programming:

```cpp
// Nothing here, so here's a duck 🦆
```

### Basic Template

Here's a basic template that you could use to start off which contains common constants and imports. It's nothing much but it's honest work.

```cpp
#include <bits/stdc++.h>
using namespace std;

typedef long long ll;
typedef vector<int> vi;

void solve() { return; }

int main() {
  ios::sync_with_stdio(0);
  cin.tie(0); // don't mix C scanf() with C++ cin with this
  cout.tie(0);

  // freopen("input.txt", "r", stdin);
  // May use diff ./output.txt ./expected.txt to assert correctness
  // freopen("output.txt", "w", stdout); // write stdout to output.txt

  solve();
  return 0;
}
```

You can either use `freopen` to write to external file or just pipe it, the latter is much preferred as you might end up forgetting to delete `freopen` and submitting it to the judge which might lead to a wrong answer verdict. To pipe input and output files to and from your program, simply use this:

```bash
./program < input.txt > out.txt
```

After which, compare your program's output with the problem's sample output. However, you should not rely on just the sample output to assert the correctness of your code, do look out for edge cases like the extreme positive and negative ends of the input or extremely large values that may exceed the limit of a normal `int`.

```bash
diff out.txt sample-out.txt
```

To compile your program, you may use the following compiler flags (see [here](https://codeforces.com/blog/entry/79024?locale=en) for more details):
```bash
g++ -std=c++17 -Wall -Wextra -Wshadow -D_GLIBCXX_ASSERTIONS -DDEBUG -ggdb3 -fmax-errors=2 your_file.cpp -o build/your_file
```

### Basic I/O

Problems with basic I/O will usually specify the number of tests cases with a simple output format of just printing out the solution. For instance, in our earlier Solving for Carrots problem with only 1 test case, a simple routine as follows would suffice:

```cpp
int main() {
  int n, p;
  scanf("%d %d\n", &n, &p);

  printf("%d", p);
  return 0;
}
```

As for problems with multiple test cases, a loop will be required as seen in [UVa 11547 - Automatic Answer](https://onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=2542). The problem description specifies the variable t = number of test cases, and following will be n lines which should be substituted into a formula.

```cpp
int main() {
  int t;
  ll n;
  while(t--) {
    scanf("%d", &n);

    int ans = abs(((((n * 567) / 9) + 7492) * 235) / 47 - 498);
    // To get 10th digit, e.g. 123456
    int digit = a % 100; // = 56 or the remainder of 123456 / 100
    printf("%d\n", r / 10); // get the quotient
  }
}

```

### Variable Input

Certain problems may not provide the number of cases as part of the input, but may specify some sort of condition for termination. For example, in [Kattis - Mia](https://open.kattis.com/contests/s2y2t5/problems/mia), the input is terminated by a line of 4 zeroes:

```cpp
int main() {
  int s0, s1, t0, t1;
  while (scanf("%d %d %d %d", &s1, &s0, &t0, &t1) == 4, (s0 + s1 + t0 + t1 != 0)) {
    // ...
  }
}
```

Likewise, in [Kattis - Statistics](https://open.kattis.com/problems/statistics), the number of test cases remains unknown, but the termination critera for this problem is `EOF` instead of detecting a specific input in stdin:

```cpp
int main() {
  int n;
  while (scanf("%d", &n) != EOF) {
    while (n--) {
      int i; scanf("%d", &i);
      // ...
    }
  }
}
```

### Tips and Tricks for I/O

After completing the previously shown problems, you might notice a patterns:

- Common imports like `#include <bits/stdc++.h>` and useful type definitions for `long long` and `vector<int>`.
- `scanf()` returns the number of items read, and can be used to detect `EOF`.
- `printf()` can be used to format string, i.e. `printf("Case %d: %d", count, n)`.
- `while()` allows for multiple conditions, i.e. `while(scanf("%d", &n) != EOF, (n != 0))`.
- With `cin.tie(0)`, you should not mix `cin/cout` with `scanf()/printf()` as it may lead to unexpected behaviours, see [here](https://usaco.guide/general/fast-io?lang=cpp) for more information on this.

## Conclusion

You have reached the end of this article, so go ahead and submit your first solution to the judge!
