const Manager = require("./lib/Manager");
const Engineer = require("./lib/Engineer");
const Intern = require("./lib/Intern");
const inquirer = require("inquirer");
const path = require("path");
const fs = require("fs");

const OUTPUT_DIR = path.resolve(__dirname, "output");
const outputPath = path.join(OUTPUT_DIR, "team.html");

const render = require("./lib/htmlRenderer");

// An empty "teamMembers" array to push all employee info
const teamMembers = [];

// Functions below use inquirer to provide questions for creating employees
managerInfo = () => {
    inquirer.prompt([
        {
            type: 'input',
            name: 'name',
            message: 'Manager name?'
        },
        {
            type: 'input',
            name: 'idNum',
            message: 'Manager ID number?'
        },
        {
            type: 'input',
            name: 'email',
            message: 'Manager email?'
        },
        {
            type: 'input',
            name: 'officeNum',
            message: 'Manager office number?'
        }

        // Takes the answers to Manager Info and pushes them to the team member array
    ]).then(managerAnswers => {
        let manager = new Manager(managerAnswers.name, managerAnswers.idNum, managerAnswers.email, managerAnswers.officeNum);
        teamMembers.push(manager);
        employeeInfo();
    });
}

employeeInfo = () => {
    inquirer.prompt([
        {
            type: 'list',
            name: 'role',
            message: 'Choose an employee role to add.',
            choices: [
                'Engineer',
                'Intern'
            ]
        },
        {
            type: 'input',
            name: 'employeeName',
            message: 'Employee Name?'
        },
        {
            type: 'input',
            name: 'employeeIdnum',
            message: 'Employee ID number?'
        },
        {
            type: 'input',
            name: 'employeeEmail',
            message: 'Employee email?'
        },
        {
            type: 'input',
            name: 'engineerGithub',
            message: 'Engineer Github?',
            // Uses the "when" question object to only provide this question when the role is Engineer
            when: function (answers) {
                return answers.role == 'Engineer'
            }
        },
        {
            type: 'input',
            name: 'internSchool',
            message: 'Intern School?',
            // Uses the "when" question object to only provide this question when the role is Intern
            when: function (answers) {
                return answers.role == 'Intern'
            }
        },
        {
            type: 'confirm',
            name: 'newEmployee',
            message: 'Add a new employee?'
        }

        // After user has input all the answers, the answers are pushed to new classes respectively and pushes to teamMember array
    ]).then(empAnswers => {
        if (empAnswers.role == 'Engineer') {
            let engineer = new Engineer(empAnswers.employeeName, empAnswers.employeeIdnum, empAnswers.employeeEmail, empAnswers.engineerGithub);
            teamMembers.push(engineer);
        } else if (empAnswers.role == 'Intern') {
            let intern = new Intern(empAnswers.employeeName, empAnswers.employeeIdnum, empAnswers.employeeEmail, empAnswers.internSchool);
            teamMembers.push(intern);
        }

        // User is taken back through the employee info questions, should they like to add additional team members.
        if (empAnswers.newEmployee === true) {
            employeeInfo();

            // If no other employees are chosen to be added, html file is written using "render" function.
        } else {
            const htmlTemplate = render(teamMembers)
            fs.writeFile(outputPath, htmlTemplate, (err) => {
                if (err) {
                    console.log(err)
                    return;
                }
                console.log("File successfully written in output folder!")
            })
        }
    });
}

// Begins Application
managerInfo();

