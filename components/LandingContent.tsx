import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const testimonials = [
  {
    name: "Sophie Turner",
    avatar: "S",
    title: "Product Manager",
    description:
      "Absolutely love the intuitive design. It streamlined our workflow!",
  },
  {
    name: "Liam Nguyen",
    avatar: "L",
    title: "Frontend Developer",
    description: "Slick interface and seamless integration. Highly recommend!",
  },
  {
    name: "Aisha Khan",
    avatar: "A",
    title: "UX Designer",
    description: "This tool improved my team's collaboration dramatically.",
  },
  {
    name: "Carlos Rodríguez",
    avatar: "C",
    title: "DevOps Engineer",
    description: "Fast, reliable, and easy to use. Just what we needed!",
  },
];

const LandingContent = () => {
  const renderTestimonials = testimonials.map((item, idx) => {
    const { avatar, description, name, title } = item;
    return (
      <Card
        key={idx}
        className="bg-[#192339] border-purple-400 shadow-2xl text-white"
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-x-2">
            <div className="w-8 h-8 flex items-center justify-center drop-shadow-2xl rounded-full bg-pink-600">
              {avatar}
            </div>
            <div>
              <p className="text-lg">{name}</p>
              <p className="text-zinc-400 text-sm">{title}</p>
            </div>
          </CardTitle>
          <CardContent className="pt-4 px-0">{description}</CardContent>
        </CardHeader>
      </Card>
    );
  });
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {renderTestimonials}
      </div>
    </div>
  );
};

export default LandingContent;
