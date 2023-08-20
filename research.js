let obj = {
    "Terminology":
    {
        CXR: { name: "Chest X-Ray Image" },
        DT: { name: "Decision Tree" },
        DR: { name: "Decision rules" },
        FIRM:{name:"Feature Importance Ranking Measure"},
        FI: {
            name: "Feature Importance",
            meaning:"((Usually)-A visualization) technique that highlights the most important regions or features in an image or input data that contribute to the prediction or decision made by a machine learning model."
        },
        SM: {
            name: "Saliency Mask (Visualization of FI)",
            meaning: "A visualization technique that highlights the most important regions or features in an image or input data that contribute to the prediction or decision made by a machine learning model."
        },
        SA: {
            name: "Sensitivity Analysis",
            meaning: "A method used to assess the impact of variations in input parameters on the output of a model or system."
        },
        PDP: {
            name: "Partial Dependence Plot",
            meaning: "a graphical representation that shows the relationship between a target variable and a specific feature while holding all other features constant in a machine learning model",

        },
        PS: {
            name: "Prototype Selection",
            meaning: "aims to select a representative subset of instances from a dataset to improve efficiency and generalization performance."
        },
        AM: {
            name: "Activation Maximization",
            meaning: "generate input patterns that maximize the activation of a specific neuron or feature in a neural network."
        },
        TE: {
            name: "Tree Ensemble",
            meaning: "Combines multiple decision trees to make more accurate predictions."
        },
        NLM: { name: "Non-Linear Models" },
    },
    "New Studies": {
        "Local Interpretable Model-Agnostic Explanations (LIME)": {},
        "Class activation mapping (CAM)": {},
        "Deep SHapley Additive exPlanations (Deep SHAP)": {},
        "LRP (Layer-wise Relevance Propagation)": {},
        "DeepLIFT (Deep Learning Important FeaTures)": {},

    },
    "DeepLIFT": {
        acronym: " Deep Label-Specific Feature",
        meaning: "",
    },

    "XAI": {

        survey: [
            {
                name: "A Survey of Methods for Explaining Black Box Models",
                year: "2018",
                link: "https://dl.acm.org/doi/pdf/10.1145/3236009",
                details: {
                    AGN: {
                        name: "Angostic explanator, for explaining blackboxes",
                    },
                    problem: [
                        "Model Explanation", "Outcome Explanation", "Model Inspection", "Transparent Design"
                    ],
                    explanator: [
                        "DT–Decision Tree", "DR–Decision Rules", "FI–Features Importance",
                        "SM–Saliency Masks", "SA–Sensitivity Analysis", "PDP–Partial Dependence Plot",
                        "AM–Activation Maximization", "PS–Prototype Selection"
                    ],
                    blackbox: [
                        "NN–Neural Network", "TE–Tree Ensemble", "SVM–Support Vector Machines",
                        "DNN–Deep Neural Network", "AGN–AGNostic black box", "NLM–Non Linear Models"
                    ],
                    datatype: [
                        "TAB–TABular", "IMG–IMaGe", "TXT–TeXT", "ANY"
                    ],
                    "Blackbox opening methods":[
                        {
                            name:"Model Explanation",
                            methods:[
                                {
                                    name:"STA",
                                    backbox:"TE",
                                    explanator:"DT",
                                    data:"TAB",
                                    journal:"Interpreting Models via Single Tree Approximation",
                                    year:2016,
                                    dataset:false,
                                    link:"https://doi.org/10.48550/arXiv.1610.09036",
                                },
                                {
                                    name:"",
                                    backbox:"TE",
                                    explanator:"DT",
                                    data:"TAB",
                                    journal:"Making Tree Ensembles Interpretable",
                                    year:2016,
                                    dataset:true,
                                    link:"https://doi.org/10.48550/arXiv.1611.07115",
                                },
                                {
                                    name:"PALM",
                                    backbox:"AGN",
                                    explanator:"DT",
                                    data:"ANY",
                                    journal:"https://doi.org/10.1145/3077257.3077271",
                                    year:2017,
                                    dataset:true,
                                    link:"https://doi.org/10.1145/3077257.3077271",
                                },
                                //etc
                            ]
                        }
                    ]
                }
            }
        ]
    }
}