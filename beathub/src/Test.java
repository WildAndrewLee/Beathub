import java.io.*;

public class Test {
	public static void main(String[] args) throws Exception{		
		InputStream stream = new FileInputStream(args[0]);
		BufferedInputStream input = new BufferedInputStream(stream);
		
		WAVProcessor processor = new WAVProcessor();
		
		processor.loadWav(input);
		byte[][] channels = processor.deinterleave();
		
		for(int n = 0; n < channels.length; n++){
			FileOutputStream fos = new FileOutputStream("media/" + args[0].split("\\")[args[0].split("\\").length - 1].split("\\.")[0] + " channel - " + (n + 1) + ".wav");
			fos.write(channels[n]);
			fos.close();
		}
		
		System.out.println(processor);
	}
}