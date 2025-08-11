export type Question = {
  question: string;
  answer?: string;
  author?: string;
};

export const allQuestions: Question[] = [
  {
    question: "What is the difference between Docker and a Virtual Machine?",
    answer: "Docker containers share the host OS kernel, making them lightweight and fast to start. Virtual Machines (VMs) virtualize the hardware, running a full guest OS, which makes them more isolated but also heavier and slower."
  },
  {
    question: "Explain the concept of 'Infrastructure as Code' (IaC).",
    answer: "IaC is the practice of managing and provisioning computing infrastructure through machine-readable definition files, rather than physical hardware configuration or interactive configuration tools. Tools like Terraform and Ansible are commonly used."
  },
  {
    question: "What is a Kubernetes Pod?",
    answer: "A Pod is the smallest and simplest unit in the Kubernetes object model that you create or deploy. A Pod represents a set of running containers on your cluster."
  },
  {
    question: "What is CI/CD?",
    answer: "CI/CD stands for Continuous Integration and Continuous Delivery/Deployment. It's a practice that automates the software development lifecycle, from building and testing to delivery and deployment."
  },
];

// This can be removed if all community questions are fetched from the sheet.
// Kept for fallback or if you want some initial static questions.
export const communityQuestions: Question[] = [];
