const sampleTests = [
  {
    id: "test-jee-main-2026-01",
    title: "JEE Main 2026 - All India Full Mock Test 01",
    description: "Comprehensive Full-Syllabus Mock Test modeled on official NTA JEE Main pattern. Contains Physics, Chemistry, and Mathematics with Single Choice and Numerical Value questions.",
    category: "JEE Main",
    durationMinutes: 180,
    totalMarks: 300,
    isPublished: true,
    sections: [
      {
        name: "Physics",
        instructions: "Section 1: 5 MCQs (+4 for correct, -1 for incorrect). Section 2: Numerical value questions (+4 for correct, 0 for incorrect).",
        questions: [
          {
            id: "phy-q1",
            type: "mcq",
            questionText: "A particle of mass m is projected from the ground with an initial velocity v₀ at an angle θ with the horizontal. What is the magnitude of angular momentum of the particle about the point of projection when it reaches its maximum height?",
            options: [
              "A) (m · v₀³ · sin²θ · cosθ) / (2g)",
              "B) (m · v₀³ · sinθ · cos²θ) / (2g)",
              "C) (m · v₀³ · sin²θ · cosθ) / g",
              "D) Zero"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Rotational Dynamics & Projectile",
            difficulty: "Medium",
            explanation: "At maximum height, velocity is entirely horizontal: v = v₀ cosθ. Maximum height reached is H = (v₀² sin²θ)/(2g). Angular momentum L about origin is L = m · v_perp · r = m · (v₀ cosθ) · H = m · v₀ cosθ · (v₀² sin²θ)/(2g) = (m · v₀³ · sin²θ · cosθ)/(2g)."
          },
          {
            id: "phy-q2",
            type: "mcq",
            questionText: "Two identical concentric conducting thin spherical shells of radii R and 2R carry charges +Q and +2Q respectively. If the inner shell is now connected to earth through a thin wire, what is the new charge on the inner shell?",
            options: [
              "A) -Q",
              "B) -Q / 2",
              "C) +Q / 2",
              "D) -2Q"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Electrostatics & Potential",
            difficulty: "Medium",
            explanation: "When earthed, potential of the inner shell becomes zero: V_inner = (1 / 4πε₀) · [q_inner / R + 2Q / (2R)] = 0. Therefore: q_inner / R + Q / R = 0 => q_inner = -Q."
          },
          {
            id: "phy-q3",
            type: "mcq",
            questionText: "In a series LCR circuit, the resonance frequency is ω₀. If the capacitance is quadrupled (C' = 4C) and the inductance is halved (L' = L/2), what is the new resonance frequency ω'?",
            options: [
              "A) ω₀ / √2",
              "B) ω₀ / 2",
              "C) √2 · ω₀",
              "D) 2 · ω₀"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Alternating Current",
            difficulty: "Easy",
            explanation: "Resonance angular frequency ω₀ = 1 / √(LC). With L' = L/2 and C' = 4C, L'C' = (L/2) * 4C = 2LC. Hence ω' = 1 / √(2LC) = ω₀ / √2."
          },
          {
            id: "phy-q4",
            type: "mcq",
            questionText: "An electron is accelerated through a potential difference of 100 V. What is the approximate de Broglie wavelength associated with the electron? (Take h = 6.63 × 10⁻³⁴ J·s, m_e = 9.1 × 10⁻³¹ kg, e = 1.6 × 10⁻¹⁹ C)",
            options: [
              "A) 1.227 Å",
              "B) 0.123 Å",
              "C) 12.27 Å",
              "D) 0.012 Å"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Modern Physics & Dual Nature",
            difficulty: "Easy",
            explanation: "For an electron accelerated through potential V: λ = (12.27 / √V) Å. Here V = 100 V, so √V = 10. Thus λ = 12.27 / 10 = 1.227 Å."
          },
          {
            id: "phy-q5",
            type: "numerical",
            questionText: "A thermodynamic system undergoes a cyclic process ABCA. Along AB, work done is +50 J and 30 J of heat is absorbed. Along BC, no work is done and 40 J of heat is rejected. If heat absorbed along CA is +20 J, find the net work done by the gas in the complete cycle (in Joules).",
            options: [],
            correctAnswer: "10",
            positiveMarks: 4,
            negativeMarks: 0,
            topic: "Thermodynamics",
            difficulty: "Medium",
            explanation: "For a cyclic process, net change in internal energy ΔU_net = 0. Therefore, Q_net = W_net. Q_net = Q_AB + Q_BC + Q_CA = 30 J - 40 J + 20 J = 10 J. Hence W_net = 10 J."
          }
        ]
      },
      {
        name: "Chemistry",
        instructions: "Section 1: 5 MCQs (+4 for correct, -1 for incorrect). Section 2: Numerical value questions (+4 for correct, 0 for incorrect).",
        questions: [
          {
            id: "chem-q1",
            type: "mcq",
            questionText: "Which of the following complex ions is diamagnetic according to Crystal Field Theory?",
            options: [
              "A) [Fe(CN)₆]⁴⁻",
              "B) [FeF₆]³⁻",
              "C) [CoF₆]³⁻",
              "D) [NiCl₄]²⁻"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Coordination Compounds",
            difficulty: "Medium",
            explanation: "In [Fe(CN)₆]⁴⁻, Fe is in +2 oxidation state (d⁶ configuration). CN⁻ is a strong field ligand causing pairing of electrons in t₂g orbitals: configuration is t₂g⁶ eg⁰. All 6 electrons are paired, making it diamagnetic (spin magnetic moment = 0 BM)."
          },
          {
            id: "chem-q2",
            type: "mcq",
            questionText: "Identify the major product obtained when 2-bromopentane is heated with alcoholic KOH (dehydrohalogenation):",
            options: [
              "A) pent-2-ene (predominantly trans-pent-2-ene)",
              "B) pent-1-ene",
              "C) pentan-2-ol",
              "D) pent-2-yne"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Organic Chemistry - Elimination",
            difficulty: "Easy",
            explanation: "According to Saytzeff's (Zaitsev's) rule, the more substituted and thermodynamically stable alkene is the major product. Trans-pent-2-ene has less steric hindrance between alkyl groups than cis-pent-2-ene, making it the major product."
          },
          {
            id: "chem-q3",
            type: "mcq",
            questionText: "The rate constant of a first-order reaction is k = 6.93 × 10⁻³ s⁻¹. What is the half-life (t₁/₂) of this reaction in seconds?",
            options: [
              "A) 100 s",
              "B) 69.3 s",
              "C) 10 s",
              "D) 50 s"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Chemical Kinetics",
            difficulty: "Easy",
            explanation: "For a first order reaction, t₁/₂ = ln(2) / k = 0.693 / (6.93 × 10⁻³ s⁻¹) = 100 seconds."
          },
          {
            id: "chem-q4",
            type: "mcq",
            questionText: "According to VSEPR theory, what are the geometry and shape of Xenon Tetrafluoride (XeF₄)?",
            options: [
              "A) Octahedral geometry, Square Planar shape",
              "B) Tetrahedral geometry, Tetrahedral shape",
              "C) Trigonal bipyramidal geometry, See-saw shape",
              "D) Square planar geometry, Octahedral shape"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Chemical Bonding & Molecular Structure",
            difficulty: "Easy",
            explanation: "Xe in XeF₄ has 8 valence electrons. 4 bond pairs with F and 2 lone pairs => steric number = 6. The electron geometry is octahedral (sp³d² hybridization) with lone pairs at trans axial positions to minimize repulsions, giving a square planar molecular shape."
          },
          {
            id: "chem-q5",
            type: "numerical",
            questionText: "Calculate the total number of unpaired electrons present in the complex ion [Mn(H₂O)₆]²⁺ (Atomic number of Mn = 25).",
            options: [],
            correctAnswer: "5",
            positiveMarks: 4,
            negativeMarks: 0,
            topic: "Coordination Compounds",
            difficulty: "Easy",
            explanation: "Mn has atomic configuration [Ar] 3d⁵ 4s². For Mn²⁺, the configuration is [Ar] 3d⁵. Since H₂O is a weak field ligand, no electron pairing occurs (high-spin complex). All 5 d-orbitals contain 1 unpaired electron (t₂g³ eg²). Total unpaired electrons = 5."
          }
        ]
      },
      {
        name: "Mathematics",
        instructions: "Section 1: 5 MCQs (+4 for correct, -1 for incorrect). Section 2: Numerical value questions (+4 for correct, 0 for incorrect).",
        questions: [
          {
            id: "math-q1",
            type: "mcq",
            questionText: "Evaluate the definite integral: I = ∫[0 to π/2] (sin³x) / (sin³x + cos³x) dx.",
            options: [
              "A) π / 4",
              "B) π / 2",
              "C) π / 8",
              "D) 0"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Definite Integration",
            difficulty: "Easy",
            explanation: "Using King's Property ∫[0 to a] f(x) dx = ∫[0 to a] f(a - x) dx: I = ∫[0 to π/2] (cos³x) / (cos³x + sin³x) dx. Adding both: 2I = ∫[0 to π/2] 1 dx = π/2. Therefore, I = π/4."
          },
          {
            id: "math-q2",
            type: "mcq",
            questionText: "Find the value of lim(x → 0) (e^(sin x) - 1 - x) / x².",
            options: [
              "A) 1 / 2",
              "B) 1",
              "C) 0",
              "D) Does not exist"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Limits & Calculus",
            difficulty: "Medium",
            explanation: "Using Maclaurin series expansion: sin x = x - x³/6 + ... and e^u = 1 + u + u²/2 + ... So e^(sin x) = 1 + (x - x³/6) + (x²)/2 + ... = 1 + x + x²/2 + O(x³). Thus (e^(sin x) - 1 - x)/x² = (x²/2)/x² = 1/2."
          },
          {
            id: "math-q3",
            type: "mcq",
            questionText: "If the eccentricity of the hyperbola x²/a² - y²/b² = 1 is e₁ and the eccentricity of its conjugate hyperbola is e₂, then which relation is always true?",
            options: [
              "A) 1 / (e₁²) + 1 / (e₂²) = 1",
              "B) e₁² + e₂² = 1",
              "C) e₁ · e₂ = 1",
              "D) 1 / e₁ + 1 / e₂ = 1"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Conic Sections & Hyperbola",
            difficulty: "Medium",
            explanation: "For hyperbola e₁² = 1 + b²/a² = (a² + b²)/a², so 1/(e₁²) = a²/(a² + b²). For its conjugate hyperbola e₂² = 1 + a²/b² = (a² + b²)/b², so 1/(e₂²) = b²/(a² + b²). Adding them gives 1/(e₁²) + 1/(e₂²) = (a² + b²)/(a² + b²) = 1."
          },
          {
            id: "math-q4",
            type: "mcq",
            questionText: "If A is a 3 × 3 invertible matrix such that det(A) = 4, then find the value of det(2 · adj(A)).",
            options: [
              "A) 128",
              "B) 64",
              "C) 32",
              "D) 256"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Matrices & Determinants",
            difficulty: "Medium",
            explanation: "For an n × n matrix (here n = 3): det(k · M) = kⁿ · det(M). Therefore det(2 · adj(A)) = 2³ · det(adj(A)). Also det(adj(A)) = (det(A))^(n - 1) = 4^(3 - 1) = 4² = 16. Hence det(2 · adj(A)) = 8 × 16 = 128."
          },
          {
            id: "math-q5",
            type: "numerical",
            questionText: "The length of the latus rectum of the parabola y² = 16x is L. If a focal chord passes through (1, 4), find the value of L.",
            options: [],
            correctAnswer: "16",
            positiveMarks: 4,
            negativeMarks: 0,
            topic: "Coordinate Geometry - Parabola",
            difficulty: "Easy",
            explanation: "For the standard parabola y² = 4ax, the length of the latus rectum is simply 4a. Comparing y² = 16x with y² = 4ax yields 4a = 16. Thus L = 16."
          }
        ]
      }
    ]
  },
  {
    id: "test-jee-adv-2026-02",
    title: "JEE Advanced 2026 - Challenge Paper 01",
    description: "High-intensity conceptual test crafted for JEE Advanced aspirants with multi-concept problems and rigorous analytical challenges.",
    category: "JEE Advanced",
    durationMinutes: 180,
    totalMarks: 180,
    isPublished: true,
    sections: [
      {
        name: "Physics",
        instructions: "Advanced level single-choice and numerical questions.",
        questions: [
          {
            id: "adv-p1",
            type: "mcq",
            questionText: "A solid sphere of radius R and mass M rolls without slipping down an inclined plane of inclination θ. What is its linear acceleration down the incline?",
            options: [
              "A) (5/7) g sin θ",
              "B) (2/3) g sin θ",
              "C) (1/2) g sin θ",
              "D) (3/5) g sin θ"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Pure Rolling Dynamics",
            difficulty: "Medium",
            explanation: "For pure rolling on an inclined plane: a = (g sin θ) / (1 + I / (MR²)). For a solid sphere, I = (2/5)MR². Therefore a = (g sin θ) / (1 + 2/5) = (5/7) g sin θ."
          },
          {
            id: "adv-p2",
            type: "numerical",
            questionText: "Two ideal soap bubbles of radii 3 cm and 4 cm coalesce under isothermal conditions to form a single larger bubble in vacuum. Find the radius of the resulting bubble in cm.",
            options: [],
            correctAnswer: "5",
            positiveMarks: 4,
            negativeMarks: 0,
            topic: "Surface Tension & Elasticity",
            difficulty: "Hard",
            explanation: "In vacuum, excess pressure inside a bubble of radius r is ΔP = 4T/r. Number of moles of gas n = PV/RT = (4T/r) · (4/3 π r³) / (RT) ∝ r². Since moles are conserved under isothermal condition, r_new² = r₁² + r₂² = 3² + 4² = 25. Thus r_new = 5 cm."
          }
        ]
      },
      {
        name: "Chemistry",
        instructions: "Advanced Physical and Organic problems.",
        questions: [
          {
            id: "adv-c1",
            type: "mcq",
            questionText: "Which of the following molecules has non-zero dipole moment despite having a planar geometry?",
            options: [
              "A) ClF₃ (T-shaped)",
              "B) BF₃ (Trigonal planar)",
              "C) XeF₄ (Square planar)",
              "D) C₂H₄ (Ethylene)"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Chemical Bonding",
            difficulty: "Medium",
            explanation: "ClF₃ has a T-shaped planar molecular geometry with two lone pairs on chlorine in equatorial positions. The dipole moments of the axial Cl-F bonds cancel, but the equatorial Cl-F bond and the two lone pairs result in a net non-zero dipole moment."
          }
        ]
      },
      {
        name: "Mathematics",
        instructions: "Advanced Calculus and Algebra problems.",
        questions: [
          {
            id: "adv-m1",
            type: "mcq",
            questionText: "Let f(x) = |x - 1| + |x - 2| + |x - 3|. The minimum value of f(x) is:",
            options: [
              "A) 2",
              "B) 1",
              "C) 3",
              "D) 0"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Functions & Modulus Optimization",
            difficulty: "Easy",
            explanation: "For a sum of absolute values ∑|x - a_i| with odd number of terms, the minimum occurs at the median point, which is x = 2. At x = 2: f(2) = |2 - 1| + |2 - 2| + |2 - 3| = 1 + 0 + 1 = 2."
          }
        ]
      }
    ]
  },
  {
    id: "test-physics-mechanics-03",
    title: "JEE Main Booster - Mechanics & Laws of Motion",
    description: "Targeted subject test focusing on Newton's Laws, Friction, Circular Motion, Work Power Energy, and Center of Mass.",
    category: "Subject Test",
    durationMinutes: 60,
    totalMarks: 100,
    isPublished: true,
    sections: [
      {
        name: "Physics",
        instructions: "Full marks 100. Single correct and numerical answers.",
        questions: [
          {
            id: "mech-q1",
            type: "mcq",
            questionText: "A body of mass 2 kg moving with speed 10 m/s collides head-on elastically with another body of mass 3 kg initially at rest. What is the speed of the 2 kg body after collision?",
            options: [
              "A) -2 m/s (rebounds)",
              "B) +2 m/s",
              "C) -4 m/s",
              "D) +4 m/s"
            ],
            correctAnswer: "A",
            positiveMarks: 4,
            negativeMarks: 1,
            topic: "Collision & Center of Mass",
            difficulty: "Easy",
            explanation: "In a 1D elastic collision with u₂ = 0: v₁ = [(m₁ - m₂) / (m₁ + m₂)] · u₁ = [(2 - 3) / (2 + 3)] · 10 = (-1/5) · 10 = -2 m/s."
          },
          {
            id: "mech-q2",
            type: "numerical",
            questionText: "A car is negotiating an unbanked circular curve of radius 50 m on a horizontal road with coefficient of static friction μ = 0.5. What is the maximum safe speed of the car without skidding (in m/s)? (Take g = 9.8 m/s²). Round to nearest integer.",
            options: [],
            correctAnswer: "16",
            positiveMarks: 4,
            negativeMarks: 0,
            topic: "Circular Dynamics",
            difficulty: "Easy",
            explanation: "v_max = √(μ · g · R) = √(0.5 × 9.8 × 50) = √245 ≈ 15.65 m/s. Rounding to the nearest integer gives 16 m/s."
          }
        ]
      }
    ]
  }
];

module.exports = { sampleTests };
