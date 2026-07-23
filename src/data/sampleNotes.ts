export interface SampleNote {
  id: string;
  topic: string;
  category: string;
  iconName: string;
  notes: string;
}

export const SAMPLE_NOTES: SampleNote[] = [
  {
    id: "neuroscience",
    topic: "Neuroscience & Memory Consolidation",
    category: "Biology / Psychology",
    iconName: "Brain",
    notes: `Memory consolidation is the process by which temporary, fragile short-term memories are transformed into stable, long-term memory structures in the brain.

Key Structures:
1. Hippocampus: Functions as the temporary holding hub for episodic and declarative memories. It plays an indispensable role during the encoding phase.
2. Neocortex: Over time, memory traces undergo systems consolidation, transferring gradually from the hippocampus to distributed neural networks across the neocortex.
3. Amygdala: Modulates memory strength based on emotional arousal by releasing adrenaline and cortisol, ensuring high-salience experiences are prioritized.

Mechanisms:
- Synaptic Plasticity & Long-Term Potentiation (LTP): Repeated high-frequency stimulation at synapses strengthens synaptic transmission. Glutamate receptors (specifically NMDA and AMPA) undergo conformational modifications, enhancing signal transmission efficiency across postsynaptic dendrites.
- Sleep Dependent Consolidation: During Slow-Wave Sleep (SWS) and Rapid Eye Movement (REM) sleep, neural ensembles reactivate the pattern of activity recorded during daytime learning. This hippocampal replay drives synaptic remodeling and structural dendrite spine morphogenesis.`
  },
  {
    id: "photosynthesis",
    topic: "Photosynthesis & Cellular Respiration",
    category: "Cellular Biology",
    iconName: "Leaf",
    notes: `Photosynthesis is the biochemical pathway through which autotrophic organisms convert light energy into chemical energy stored in glucose molecules.

Phase 1: Light-Dependent Reactions (Thylakoid Membrane)
- Solar photons excite electrons within Photosystem II (PSII, P680). Photolysis of water molecules (2H2O -> 4H+ + 4e- + O2) replaces lost electrons and liberates molecular oxygen as a byproduct.
- Electrons travel along an electron transport chain (ETC) featuring plastoquinone, cytochrome b6f, and plastocyanin, creating a proton gradient across the thylakoid lumen.
- ATP Synthase utilizes this chemiosmotic proton motive force to phosphorylate ADP into ATP, while Photosystem I (PSI, P700) reduces NADP+ into NADPH.

Phase 2: Light-Independent Reactions / Calvin Cycle (Stroma)
- Carbon Fixation: RuBisCO (Ribulose-1,5-bisphosphate carboxylase-oxygenase) catalyzes the addition of CO2 to 5-carbon RuBP, forming volatile 6-carbon intermediates that split into 3-PGA.
- Reduction Phase: ATP and NADPH convert 3-PGA into glyceraldehyde-3-phosphate (G3P).
- Regeneration: Five G3P molecules rearrange via ATP energy to regenerate three RuBP molecules, maintaining cycle stoichiometry.`
  },
  {
    id: "quantum-tech",
    topic: "Quantum Computing Fundamentals",
    category: "Computer Science & Physics",
    iconName: "Cpu",
    notes: `Quantum computing leverages fundamental principles of quantum mechanics to perform computational operations exponentially faster than classical Turing machines for specific problem classes.

Core Principles:
1. Qubits & Superposition: Classical bits exist deterministically as binary 0 or 1. A qubit (quantum bit) utilizes quantum superposition, existing in a linear combination of states |Ψ⟩ = α|0⟩ + β|1⟩, where |α|² + |β|² = 1.
2. Quantum Entanglement: Non-local correlation between qubits where the quantum state of one qubit instantaneously determines the state of another, regardless of physical separation distance.
3. Quantum Interference: Constructive interference amplifies probability amplitudes corresponding to correct computational outcomes, while destructive interference cancels erroneous computational paths.

Challenges & decoherence:
- Environmental Decoherence: Interaction with external thermal or electromagnetic noise causes wave function collapse, destroying quantum coherence.
- Quantum Error Correction (QEC): Uses surface codes and physical qubits to form fault-tolerant logical qubits through stabilizer measurements.`
  },
  {
    id: "ww2-history",
    topic: "Origins of World War II & Geopolitics",
    category: "History & Political Science",
    iconName: "Globe",
    notes: `The outbreak of World War II in 1939 was catalyzed by interconnected geopolitical instability, economic crises, and aggressive expansionist ideologies resulting from the aftermath of World War I.

Primary Factors:
1. Treaty of Versailles (1919): Imposed severe territorial losses, military disarmament, and crippling financial reparations upon Germany, breeding deep revanchism and hyperinflation during the Weimar Republic.
2. Collapse of the League of Nations: Lacking enforcement mechanisms or a unified military force, the League failed to prevent imperial aggression, notably the Manchurian Crisis (1931) and Abyssinia Crisis (1935).
3. Policy of Appeasement: European powers, seeking to avoid another catastrophic military conflict, repeatedly conceded to aggressive territorial expansion, culminating in the Munich Agreement of 1938 allowing annexation of the Sudetenland.
4. Molotov-Ribbentrop Pact (August 1939): A non-aggression pact containing secret protocols dividing Eastern Europe into spheres of influence, setting the stage for the invasion of Poland on September 1, 1939.`
  }
];
