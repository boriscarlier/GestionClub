function memberDisciplineRisk(member){return disciplineForMember(member).flatMap(d=>disciplineConsequences(d));}
