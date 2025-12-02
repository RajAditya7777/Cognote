import React from 'react';

const UseCases = () => {
    const cases = [
        {
            title: "Students",
            description: "Upload course materials, readings, and lecture notes to create a personalized study guide."
        },
        {
            title: "Researchers",
            description: "Synthesize information from multiple papers and reports to find connections and insights."
        },
        {
            title: "Writers",
            description: "Organize your research, brainstorm ideas, and outline your next project."
        },
        {
            title: "Consultants",
            description: "Analyze client documents, meeting notes, and industry reports to deliver better recommendations."
        },
        {
            title: "Educators",
            description: "Create lesson plans, quizzes, and study materials from your curriculum."
        },
        {
            title: "Creatives",
            description: "Brainstorm concepts, organize inspiration, and develop your next big idea."
        }
    ];

    return (
        <section className="py-24 bg-black text-white">
            <div className="max-w-7xl mx-auto px-6">
                <h2 className="text-4xl md:text-5xl font-medium leading-tight mb-16 text-center">
                    How people are using NotebookLM
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cases.map((item, index) => (
                        <div key={index} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-colors duration-300">
                            <h3 className="text-2xl font-medium mb-4">{item.title}</h3>
                            <p className="text-gray-400 leading-relaxed">
                                {item.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default UseCases;
