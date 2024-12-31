import Image from "next/image";
export default function Avatar({ url = null }) {
  return (
    <div>
      <div className="rounded-full bg-blue-400 w-12 h-12 overflow-hidden">
        {!!url && <Image src={url} alt="avatar" width={48} height={48} />}
      </div>
    </div>
  );
}
